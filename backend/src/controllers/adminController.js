import { Admin } from "../models/Admin.js";
import jwt from "jsonwebtoken";

/* ------------------------------------------------------------------
 🧱 REGISTER ADMIN (Secure Version)
------------------------------------------------------------------ */
export const registerAdmin = async (req, res) => {
    try {
        const { name, email, staffId, department, password, role } = req.body;

        // 1️⃣ Validate required fields
        if (!name || !email || !staffId || !department || !password) {
            return res.status(400).json({
                message:
                    "All fields (name, email, staffId, department, password) are required",
            });
        }

        // 2️⃣ Ensure email domain ends with ".ac.in"
        if (!email.endsWith(".ac.in")) {
            return res
                .status(400)
                .json({ message: "Email must be a valid college email (.ac.in)" });
        }

        // 3️⃣ Check if admin already exists
        const existing = await Admin.findOne({ $or: [{ email }, { staffId }] });
        if (existing) {
            return res
                .status(400)
                .json({ message: "Admin already registered with this email or ID" });
        }

        // 4️⃣ Handle file upload (if ID card uploaded)
        const idCardFilePath = req.file ? `/uploads/idcards/${req.file.filename}` : null;

        // 5️⃣ Create new admin entry
        const newAdmin = new Admin({
            name,
            email,
            staffId,
            department,
            password,
            role: role || "departmentadmin",
            idCardFile: idCardFilePath,
            verified: false,
        });

        await newAdmin.save();

        // 6️⃣ Response
        res.status(201).json({
            message:
                "Admin registration request submitted successfully. Pending verification by Super Admin.",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                department: newAdmin.department,
                verified: newAdmin.verified,
            },
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* ------------------------------------------------------------------
 🟩 GET ALL PENDING ADMINS (SuperAdmin)
------------------------------------------------------------------ */
export const getPendingAdmins = async (req, res) => {
    try {
        const pending = await Admin.find({ verified: false }).select(
            "name email staffId department idCardFile createdAt"
        );
        res.status(200).json(pending);
    } catch (error) {
        console.error("Error fetching pending admins:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* ------------------------------------------------------------------
 🟩 APPROVE ADMIN (SuperAdmin)
------------------------------------------------------------------ */
export const approveAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Admin.findByIdAndUpdate(
            id,
            { verified: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res
            .status(200)
            .json({ message: "Admin approved successfully ✅", admin: updated });
    } catch (error) {
        console.error("Error approving admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

/* ------------------------------------------------------------------
 🟥 REJECT ADMIN (SuperAdmin)
------------------------------------------------------------------ */
export const rejectAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Admin.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res
            .status(200)
            .json({ message: "Admin rejected and removed ❌", adminId: id });
    } catch (error) {
        console.error("Error rejecting admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
