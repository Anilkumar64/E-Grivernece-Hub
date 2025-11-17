import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import Timeline from "../../components/Timeline";
import { toast } from "react-toastify";
import "./AdminGrievanceDetails.css";

export default function AdminGrievanceDetails() {
    const { id } = useParams(); // grievance _id or trackingId
    const navigate = useNavigate();

    const [grievance, setGrievance] = useState(null);
    const [loading, setLoading] = useState(true);

    // admin UI state
    const [admins, setAdmins] = useState([]);
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [timelineMsg, setTimelineMsg] = useState("");
    const [addingTimeline, setAddingTimeline] = useState(false);
    const [saving, setSaving] = useState(false);

    // fetch grievance & admins
    useEffect(() => {
        fetchGrievance();
        fetchAdmins();
        // eslint-disable-next-line
    }, [id]);

    const getTokenHeaders = () => {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    };

    const fetchGrievance = async () => {
        setLoading(true);
        try {
            // try admin endpoint first
            const res = await api.get(`/grievances/${id}`, {
                headers: getTokenHeaders(),
            });
            const data = res.data.grievance || res.data || {};
            setGrievance(data);
            setStatus(data.status || "");
            setPriority(data.priority || "Medium");
            setAssignedTo(data.assignedTo?._id || data.assignedTo || "");
        } catch (err) {
            console.error("fetch grievance error:", err);
            toast.error(err?.response?.data?.message || "Failed to load grievance");
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            const res = await api.get("/admin/list", { headers: getTokenHeaders() }); // change endpoint if needed
            setAdmins(res.data.admins || res.data || []);
        } catch (err) {
            console.warn("Could not load admins list", err);
            // admins list is optional — still continue
        }
    };

    /* ---------- Actions ---------- */

    const handleChangeStatus = async (newStatus) => {
        if (!window.confirm(`Change status to "${newStatus}" ?`)) return;
        setSaving(true);
        try {
            await api.patch(
                `/grievances/update-status/${grievance._id}`,
                { status: newStatus, message: `Status changed to ${newStatus} by admin` },
                { headers: getTokenHeaders() }
            );
            toast.success("Status updated");
            await fetchGrievance();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update status");
        } finally {
            setSaving(false);
        }
    };

    const handleAssignAdmin = async () => {
        if (!assignedTo) return toast.warn("Choose an admin to assign");
        setSaving(true);
        try {
            await api.patch(
                `/grievances/assign/${grievance._id}`,
                { assignedTo },
                { headers: getTokenHeaders() }
            );
            toast.success("Assigned successfully");
            await fetchGrievance();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to assign admin");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePriority = async () => {
        if (!priority) return toast.warn("Choose a priority");
        setSaving(true);
        try {
            await api.patch(
                `/grievances/update-priority/${grievance._id}`,
                { priority },
                { headers: getTokenHeaders() }
            );
            toast.success("Priority updated");
            await fetchGrievance();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update priority");
        } finally {
            setSaving(false);
        }
    };

    const handleAddAdminNote = async () => {
        if (!adminNote.trim()) return toast.warn("Write a note first");
        setSaving(true);
        try {
            await api.post(
                `/grievances/admin-note/${grievance._id}`,
                { note: adminNote },
                { headers: getTokenHeaders() }
            );
            toast.success("Admin note added");
            setAdminNote("");
            await fetchGrievance();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to add note");
        } finally {
            setSaving(false);
        }
    };

    const handleAddTimelineEvent = async () => {
        if (!timelineMsg.trim()) return toast.warn("Write timeline message");
        setAddingTimeline(true);
        try {
            await api.post(
                `/grievances/timeline/${grievance._id}`,
                { status: status || "Update", message: timelineMsg, date: new Date().toISOString() },
                { headers: getTokenHeaders() }
            );
            toast.success("Timeline updated");
            setTimelineMsg("");
            await fetchGrievance();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to add timeline");
        } finally {
            setAddingTimeline(false);
        }
    };

    const handleForwardEscalate = async (options = {}) => {
        // options: { escalateToSuper: true, forwardDeptId: '...' }
        if (!window.confirm("Confirm forward/escalate action?")) return;
        setSaving(true);
        try {
            await api.patch(
                `/grievances/escalate/${grievance._id}`,
                options,
                { headers: getTokenHeaders() }
            );
            toast.success("Grievance forwarded/escalated");
            await fetchGrievance();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to forward/escalate");
        } finally {
            setSaving(false);
        }
    };

    /* ---------- Render ---------- */

    if (loading) return <div className="agd-loading">Loading...</div>;
    if (!grievance) return <div className="agd-empty">No grievance found.</div>;

    const {
        title,
        description,
        trackingId,
        status: currentStatus,
        priority: currentPriority,
        attachments = [],
        timeline = [],
        adminAssigned,
        adminRemarks,
        createdAt,
        updatedAt,
        userEmail,
        department,
        complaintType,
    } = grievance;

    return (
        <div className="admin-grievance-details">
            <div className="agd-top">
                <div className="agd-left">
                    <h1>{title}</h1>
                    <div className="agd-meta">
                        <span className={`agd-badge ${currentStatus?.toLowerCase().replace(" ", "-")}`}>{currentStatus}</span>
                        <span className="agd-priority">Priority: {currentPriority}</span>
                        <span className="agd-tracking">Tracking: {trackingId}</span>
                        <span className="agd-dept">Dept: {department?.name || department || "-"}</span>
                        <span className="agd-type">Type: {complaintType?.type || complaintType || "-"}</span>
                    </div>

                    <p className="agd-desc">{description}</p>

                    <div className="agd-actions-row">
                        <button className="agd-btn" onClick={() => handleChangeStatus("In Progress")} disabled={saving}>Start</button>
                        <button className="agd-btn outline" onClick={() => handleChangeStatus("Resolved")} disabled={saving}>Resolve</button>
                        <button className="agd-btn danger" onClick={() => handleChangeStatus("Rejected")} disabled={saving}>Reject</button>
                        <button className="agd-btn" onClick={() => navigate("/admin/grievances")}>Back</button>
                    </div>

                    <section className="agd-section">
                        <h3>Admin Note</h3>
                        <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Write internal admin note (private)"></textarea>
                        <div className="agd-row">
                            <button className="agd-btn" onClick={handleAddAdminNote} disabled={saving || !adminNote.trim()}>Add Note</button>
                        </div>
                    </section>

                    <section className="agd-section">
                        <h3>Timeline Editor</h3>
                        <textarea value={timelineMsg} onChange={(e) => setTimelineMsg(e.target.value)} placeholder="Write timeline message for update (visible to user)"></textarea>
                        <div className="agd-row">
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">Select Status (optional)</option>
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Resolved</option>
                                <option>Rejected</option>
                            </select>
                            <button className="agd-btn" onClick={handleAddTimelineEvent} disabled={addingTimeline || !timelineMsg.trim()}>Add Timeline</button>
                        </div>
                    </section>
                </div>

                <aside className="agd-right">
                    <div className="agd-card">
                        <h4>Submission</h4>
                        <p><strong>By:</strong> {userEmail || "Anonymous"}</p>
                        <p className="muted">Submitted: {new Date(createdAt).toLocaleString()}</p>
                        <p className="muted">Updated: {new Date(updatedAt).toLocaleString()}</p>
                    </div>

                    <div className="agd-card">
                        <h4>Assign / Reassign</h4>
                        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                            <option value="">-- Select Admin --</option>
                            {admins.map((a) => (
                                <option key={a._id} value={a._id}>{a.name || a.email} ({a.department || "—"})</option>
                            ))}
                        </select>
                        <div className="agd-row">
                            <button className="agd-btn" onClick={handleAssignAdmin} disabled={saving}>Assign</button>
                        </div>
                        <div className="muted" style={{ marginTop: 8 }}>
                            Current: {adminAssigned?.name || adminAssigned?.email || "Not assigned"}
                        </div>
                    </div>

                    <div className="agd-card">
                        <h4>Priority</h4>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>
                        <div className="agd-row">
                            <button className="agd-btn" onClick={handleChangePriority} disabled={saving}>Save</button>
                        </div>
                    </div>

                    <div className="agd-card">
                        <h4>Attachments</h4>
                        {attachments.length ? (
                            <ul className="agd-attach">
                                {attachments.map((a, idx) => {
                                    const url = a.startsWith("http") ? a : `/uploads/${a}`;
                                    return (
                                        <li key={idx}><a href={url} target="_blank" rel="noreferrer">Attachment {idx + 1}</a></li>
                                    );
                                })}
                            </ul>
                        ) : <p className="muted">No attachments</p>}
                    </div>

                    <div className="agd-card">
                        <h4>Forward / Escalate</h4>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="agd-btn" onClick={() => handleForwardEscalate({ escalateToSuper: true })}>Escalate to SuperAdmin</button>
                            <button className="agd-btn outline" onClick={() => {
                                const deptId = prompt("Forward to Department Id (enter dept _id):");
                                if (deptId) handleForwardEscalate({ forwardDeptId: deptId });
                            }}>Forward to Dept</button>
                        </div>
                    </div>
                </aside>
            </div>

            <div className="agd-timeline-area">
                <h3>Timeline</h3>
                <Timeline events={timeline || []} />
            </div>
        </div>
    );
}
