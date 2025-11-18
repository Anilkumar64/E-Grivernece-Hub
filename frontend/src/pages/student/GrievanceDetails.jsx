import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import Timeline from "../../components/Timeline";
import { toast } from "react-toastify";
// import "..styles/GrievanceDetails.css";

export default function GrievanceDetails() {
    const { id } = useParams(); // id may be _id or trackingId depending on route
    const navigate = useNavigate();

    const [grievance, setGrievance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [sendingComment, setSendingComment] = useState(false);

    useEffect(() => {
        fetchGrievance();
        // eslint-disable-next-line
    }, [id]);

    const fetchGrievance = async () => {
        setLoading(true);
        try {
            // Try fetching by id. If your backend uses /track/:trackingId, adjust accordingly.
            const token = localStorage.getItem("token");
            const res = await api.get(`/grievances/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // backend might return object or { grievance: {...} }
            const data = res.data.grievance || res.data || {};
            setGrievance(data);
        } catch (err) {
            console.error("Fetch grievance error:", err);
            toast.error(err?.response?.data?.message || "Failed to load grievance");
            // optionally try track endpoint
            try {
                const token = localStorage.getItem("token");
                const res2 = await api.get(`/grievances/track/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data2 = res2.data.grievance || res2.data || {};
                setGrievance(data2);
            } catch (err2) {
                console.error("fallback track fetch failed:", err2);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return toast.warn("Write a comment first.");

        setSendingComment(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.post(
                `/grievances/comment/${grievance._id || grievance.trackingId}`,
                { comment: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Comment added");
            setCommentText("");
            // refresh grievance to show comment + timeline update
            await fetchGrievance();
        } catch (err) {
            console.error("Add comment error:", err);
            toast.error(err?.response?.data?.message || "Failed to add comment");
        } finally {
            setSendingComment(false);
        }
    };

    const handleRequestClose = async () => {
        if (!window.confirm("Request to close this grievance?")) return;
        try {
            const token = localStorage.getItem("token");
            await api.patch(
                `/grievances/update-status/${grievance._id}`,
                { status: "Resolved", message: "Student requested closure" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Close request submitted");
            fetchGrievance();
        } catch (err) {
            console.error("Request close error:", err);
            toast.error(err?.response?.data?.message || "Failed to request close");
        }
    };

    if (loading) return <div className="gd-loading">Loading grievance...</div>;
    if (!grievance) return <div className="gd-empty">No grievance found.</div>;

    const {
        title,
        description,
        trackingId,
        status,
        priority,
        attachments = [],
        timeline = [],
        adminAssigned,
        adminRemarks,
        createdAt,
        updatedAt,
        userEmail,
    } = grievance;

    return (
        <div className="grievance-details-page">
            <div className="gd-header">
                <div className="gd-left">
                    <h1>{title}</h1>
                    <div className="gd-meta">
                        <span className={`gd-badge ${status?.toLowerCase().replace(" ", "-")}`}>{status}</span>
                        <span className="gd-priority">Priority: {priority || "Medium"}</span>
                        <span className="gd-tracking">Tracking: {trackingId || "N/A"}</span>
                    </div>
                    <p className="gd-desc">{description}</p>

                    <div className="gd-actions">
                        <button onClick={() => navigate("/student/grievances")} className="gd-btn">Back</button>
                        <button onClick={handleRequestClose} className="gd-btn outline">Request Close</button>
                    </div>
                </div>

                <aside className="gd-right">
                    <div className="gd-card">
                        <h4>Submitted By</h4>
                        <p>{userEmail || "Anonymous"}</p>
                        <p className="muted">Submitted: {new Date(createdAt).toLocaleString()}</p>
                    </div>

                    <div className="gd-card">
                        <h4>Assigned Admin</h4>
                        {adminAssigned ? (
                            <>
                                <p>{adminAssigned.name || adminAssigned.username || "Admin"}</p>
                                <p className="muted">{adminAssigned.email}</p>
                                <p className="muted">Dept: {adminAssigned.department || "—"}</p>
                            </>
                        ) : (
                            <p className="muted">Not assigned yet</p>
                        )}
                    </div>

                    <div className="gd-card">
                        <h4>Attachments</h4>
                        {attachments.length ? (
                            <ul className="gd-attach-list">
                                {attachments.map((a, idx) => {
                                    const url = a.startsWith("http") ? a : `/uploads/${a}`;
                                    return (
                                        <li key={idx}>
                                            <a href={url} target="_blank" rel="noreferrer">Attachment {idx + 1}</a>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="muted">No attachments</p>
                        )}
                    </div>

                    <div className="gd-card">
                        <h4>Admin Remarks</h4>
                        <p>{adminRemarks || "—"}</p>
                        <p className="muted">Last updated: {new Date(updatedAt).toLocaleString()}</p>
                    </div>
                </aside>
            </div>

            <div className="gd-main">
                <div className="gd-timeline-col">
                    <h3>Timeline</h3>
                    <Timeline events={timeline || []} />
                </div>

                <div className="gd-comments-col">
                    <h3>Comments</h3>

                    <div className="gd-comments-list">
                        {(grievance.comments || []).length === 0 && <p className="muted">No comments yet — be first to reply.</p>}
                        {(grievance.comments || []).map((c) => (
                            <div className="gd-comment" key={c._id || c.createdAt}>
                                <div className="gd-comment-head">
                                    <strong>{c.authorName || c.author || (c.isAdmin ? "Admin" : "You")}</strong>
                                    <span className="muted">{new Date(c.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="gd-comment-body">{c.text || c.comment}</div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddComment} className="gd-comment-form">
                        <textarea
                            placeholder="Write a comment or reply..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            rows={4}
                        />
                        <div className="gd-comment-actions">
                            <button type="submit" disabled={sendingComment} className="gd-btn">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
