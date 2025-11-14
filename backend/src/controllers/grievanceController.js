// src/controllers/grievanceController.js
import Grievance from "../models/Grievance.js";
import User from "../models/User.js";
import Department from "../models/Department.js";
import Admin from "../models/Admin.js";

import sendEmail from "../utils/sendEmail.js";

/**
 * @desc  Submit a new grievance (complaint)
 * @route POST /api/grievances
 * @access Private (student)
 */
export const createGrievance = async (req, res) => {
    try {
        const { title, description, department, priority, isAnonymous, attachments } = req.body;

        // logged-in user details from auth middleware
        const userId = req.user._id;
        const user = await User.findById(userId).select("name email");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ensure department exists
        const dept = await Department.findById(department).populate("headOfDepartment", "name email");
        if (!dept) return res.status(404).json({ message: "Department not found" });

        // create grievance entry
        const grievance = await Grievance.create({
            user: userId,
            userEmail: user.email,
            department,
            title,
            description,
            priority,
            isAnonymous,
            attachments,
        });

        // increment department complaint counters
        await Department.findByIdAndUpdate(department, {
            $inc: { totalComplaints: 1, activeComplaints: 1 },
        });

        // prepare email content
        const userEmailSubject = "Grievance Submitted Successfully";
        const userEmailBody = `Dear ${user.name},\n\nYour grievance titled "${title}" has been successfully submitted.\nTracking ID: ${grievance.trackingId}\n\nWe will update you once it progresses.\n\nBest regards,\nE-Grievance Hub`;

        const deptEmailSubject = `New Grievance Received: ${title}`;
        const deptEmailBody = `Hello ${dept.name} Team,\n\nA new grievance has been submitted to your department.\n\nTitle: ${title}\nSubmitted By: ${isAnonymous ? "Anonymous" : user.name}\nUser Email: ${user.email}\nPriority: ${priority || "Medium"}\nTracking ID: ${grievance.trackingId}\n\nDescription:\n${description}\n\nPlease review and assign it to an admin.\n\n- E-Grievance Hub`;

        // send emails in parallel (user + department + head of department if present)
        const emailPromises = [
            sendEmail(user.email, userEmailSubject, userEmailBody),         // confirmation to user
            sendEmail(dept.email, deptEmailSubject, deptEmailBody),         // notification to dept mailbox
        ];

        // if department has a headOfDepartment with email, notify them too
        if (dept.headOfDepartment && dept.headOfDepartment.email) {
            const hod = dept.headOfDepartment;
            const hodEmailSubject = `Action Required: New Grievance for ${dept.name}`;
            const hodEmailBody = `Dear ${hod.name},\n\nA new grievance has been filed under ${dept.name}.\n\nTitle: ${title}\nTracking ID: ${grievance.trackingId}\nSubmitted By: ${isAnonymous ? "Anonymous" : user.name} (${user.email})\n\nPlease assign or take necessary action.\n\n- E-Grievance Hub`;
            emailPromises.push(sendEmail(hod.email, hodEmailSubject, hodEmailBody));
        }

        // attempt to send all emails; we do not fail the request if email sending fails,
        // but we log errors and include a flag in the response if desired.
        let emailResults = [];
        try {
            emailResults = await Promise.allSettled(emailPromises);
        } catch (e) {
            // shouldn't reach here because Promise.allSettled never rejects, but just in case
            console.error("Unexpected error while sending emails:", e);
        }

        // gather simple status for response
        const emailSummary = emailResults.map((r, idx) => ({
            index: idx,
            status: r.status,
            reason: r.reason?.message || null,
        }));

        res.status(201).json({
            message: "Grievance submitted successfully",
            grievance,
            emailSummary,
        });
    } catch (error) {
        console.error("Error submitting grievance:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

/**
 * @desc  Get all grievances for logged-in user
 * @route GET /api/grievances/my
 * @access Private (student)
 */
export const getMyGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({ user: req.user._id })
            .populate("department", "name code")
            .sort({ createdAt: -1 });
        res.json(grievances);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch grievances" });
    }
};

/**
 * @desc  Get grievance details by tracking ID
 * @route GET /api/grievances/:trackingId
 * @access Private
 */
export const getGrievanceByTrackingId = async (req, res) => {
    try {
        const grievance = await Grievance.findOne({
            trackingId: req.params.trackingId,
        })
            .populate("user", "name email")
            .populate("department", "name");

        if (!grievance)
            return res.status(404).json({ message: "Grievance not found" });

        res.json(grievance);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch grievance details" });
    }
};

/**
 * @desc  Admin updates grievance status
 * @route PUT /api/grievances/:id/status
 * @access Private (admin)
 */
export const updateGrievanceStatus = async (req, res) => {
    try {
        const { status, adminRemarks } = req.body;
        const grievance = await Grievance.findById(req.params.id);

        if (!grievance)
            return res.status(404).json({ message: "Grievance not found" });

        grievance.status = status;
        grievance.adminRemarks = adminRemarks;

        if (status === "Resolved" || status === "Rejected") {
            grievance.resolutionDate = new Date();
            await Department.findByIdAndUpdate(grievance.department, {
                $inc: { activeComplaints: -1, resolvedComplaints: 1 },
            });
        }

        await grievance.save();

        // email update to user
        await sendEmail(
            grievance.userEmail,
            `Grievance Status Update: ${status}`,
            `Your grievance "${grievance.title}" has been updated to "${status}".\n\nRemarks: ${adminRemarks || "No remarks provided."}\n\nTracking ID: ${grievance.trackingId}\n\n- E-Grievance Hub`
        );

        res.json({ message: "Grievance status updated successfully", grievance });
    } catch (error) {
        res.status(500).json({ message: "Failed to update grievance", error });
    }
};
