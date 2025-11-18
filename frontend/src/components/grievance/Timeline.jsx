import React from "react";
// import "./Timeline.css";

/**
 * Timeline expects `events` array sorted ascending (oldest first)
 * Each event: { status: "Submitted", message: "text", date: ISOString }
 */
export default function Timeline({ events = [] }) {
    // ensure sorted oldest -> newest
    const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!sorted.length) {
        return <div className="tl-empty">No timeline events yet.</div>;
    }

    return (
        <div className="timeline">
            {sorted.map((ev, idx) => (
                <div className="tl-item" key={idx}>
                    <div className="tl-marker" />
                    <div className="tl-body">
                        <div className="tl-head">
                            <div className="tl-status">{ev.status || ev.title || "Update"}</div>
                            <div className="tl-date">{new Date(ev.date || ev.createdAt).toLocaleString()}</div>
                        </div>
                        {ev.message && <div className="tl-message">{ev.message}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}
