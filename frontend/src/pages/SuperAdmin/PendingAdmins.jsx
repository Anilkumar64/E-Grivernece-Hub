import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
// import "..styles/PendingAdmins.css";

/**
 * SuperAdmin - Pending Admin Approvals
 *
 * Expected backend endpoints:
 * GET  /superadmin/pending-admins           -> returns [{ _id, name, email, staffId, department, idCardFile, createdAt }, ...]
 * PATCH /superadmin/approve-admin/:id       -> approves admin
 * DELETE /superadmin/reject-admin/:id      -> rejects admin (or PATCH depending on API)
 *
 * Adjust endpoints if your backend uses different names.
 */

export default function PendingAdmins() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    // modal state
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewName, setPreviewName] = useState(null);

    useEffect(() => {
        fetchPending();
        // eslint-disable-next-line
    }, []);

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    const fetchPending = async () => {
        setLoading(true);
        try {
            const res = await api.get("/superadmin/pending-admins", { headers });
            // support both res.data and res.data.admins
            setPending(res.data?.admins || res.data || []);
        } catch (err) {
            console.error("fetchPending:", err);
            toast.error(err?.response?.data?.message || "Failed to load pending admins");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this admin?")) return;
        try {
            await api.patch(`/superadmin/approve-admin/${id}`, {}, { headers });
            toast.success("Admin approved ✅");
            fetchPending();
        } catch (err) {
            console.error("approve error:", err);
            toast.error(err?.response?.data?.message || "Approval failed");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject and delete this admin request?")) return;
        try {
            await api.delete(`/superadmin/reject-admin/${id}`, { headers });
            toast.success("Admin request rejected ❌");
            fetchPending();
        } catch (err) {
            console.error("reject error:", err);
            toast.error(err?.response?.data?.message || "Reject failed");
        }
    };

    const openPreview = (filePath, name) => {
        // filePath might be a full URL or a relative path (uploads/...)
        const url = filePath?.startsWith("http") ? filePath : `/uploads/${filePath}`;
        setPreviewName(name);
        setPreviewUrl(url);
    };

    const closePreview = () => {
        setPreviewUrl(null);
        setPreviewName(null);
    };

    return (
        <div className="pa-container">
            <h2>Pending Admin Approvals</h2>

            {loading ? (
                <div className="pa-loading">Loading pending requests…</div>
            ) : pending.length === 0 ? (
                <div className="pa-empty">No pending admin requests 🎉</div>
            ) : (
                <div className="pa-grid">
                    {pending.map((req) => (
                        <div className="pa-card" key={req._id}>
                            <div className="pa-row">
                                <div>
                                    <h3>{req.name || req.username || "No name"}</h3>
                                    <div className="pa-meta">
                                        <span className="muted">{req.email}</span>
                                        <span className="muted"> | ID: {req.staffId}</span>
                                    </div>
                                    <div className="pa-meta">Dept: {req.department || "—"}</div>
                                </div>

                                <div className="pa-actions">
                                    <button className="btn small" onClick={() => openPreview(req.idCardFile, req.name)}>View ID</button>
                                    <button className="btn approve" onClick={() => handleApprove(req._id)}>Approve</button>
                                    <button className="btn reject" onClick={() => handleReject(req._id)}>Reject</button>
                                </div>
                            </div>

                            <div className="pa-footer">
                                <small>Requested: {new Date(req.createdAt).toLocaleString()}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* simple preview modal */}
            {previewUrl && (
                <div className="pa-modal" onClick={closePreview}>
                    <div className="pa-modal-inner" onClick={(e) => e.stopPropagation()}>
                        <div className="pa-modal-header">
                            <h4>ID card — {previewName}</h4>
                            <button className="btn small" onClick={closePreview}>Close</button>
                        </div>

                        <div className="pa-modal-body">
                            {/* Use <img> when image, otherwise embed */}
                            {/\.(png|jpe?g|gif|webp)$/i.test(previewUrl) ? (
                                <img src={previewUrl} alt="idcard" />
                            ) : (
                                <iframe title="preview" src={previewUrl} style={{ width: "100%", height: "70vh", border: 0 }} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
