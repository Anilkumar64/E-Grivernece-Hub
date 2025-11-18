import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import "..styles/MyGrievances.css";

const PAGE_SIZE = 6;

export default function MyGrievances() {
    const navigate = useNavigate();
    const [grievances, setGrievances] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI controls
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [deptFilter, setDeptFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);

    // fetch data
    useEffect(() => {
        fetchMyGrievances();
    }, []);

    useEffect(() => {
        applyFilters();
        // reset to page 1 whenever filters/search change
        setPage(1);
    }, [grievances, search, statusFilter, deptFilter, sortBy]);

    const fetchMyGrievances = async () => {
        setLoading(true);
        try {
            // attach token header (axiosInstance may not add it automatically)
            const token = localStorage.getItem("token");
            const res = await api.get("/grievances/my", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // expecting array
            setGrievances(Array.isArray(res.data) ? res.data : res.data.grievances || []);
        } catch (err) {
            console.error("fetchMyGrievances:", err);
            toast.error(err?.response?.data?.message || "Failed to fetch grievances");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let list = [...grievances];

        // search by title or trackingId
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (g) =>
                    (g.title && g.title.toLowerCase().includes(q)) ||
                    (g.trackingId && g.trackingId.toLowerCase().includes(q))
            );
        }

        // status filter
        if (statusFilter !== "all") {
            list = list.filter((g) => (g.status || "").toLowerCase() === statusFilter.toLowerCase());
        }

        // department filter (department may be object or string)
        if (deptFilter !== "all") {
            list = list.filter((g) => {
                const d = g.department;
                if (!d) return false;
                if (typeof d === "string") return d === deptFilter;
                return (d._id || d.id) === deptFilter || (d.name || "").toLowerCase() === deptFilter.toLowerCase();
            });
        }

        // sort
        if (sortBy === "newest") {
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === "oldest") {
            list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === "priority") {
            const rank = { critical: 4, high: 3, medium: 2, low: 1 };
            list.sort((a, b) => (rank[b.priority?.toLowerCase()] || 0) - (rank[a.priority?.toLowerCase()] || 0));
        }

        setFiltered(list);
    };

    // pagination helpers
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const gotoDetails = (id, trackingId) => {
        // prefer details route by id; also allow track by trackingId
        navigate(`/student/grievance/${id || trackingId}`);
    };

    return (
        <div className="my-grievances-page">
            <div className="mg-header">
                <h2>My Grievances</h2>

                <div className="mg-actions">
                    <input
                        placeholder="Search by title or tracking ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mg-search"
                    />

                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="priority">Priority</option>
                    </select>
                </div>
            </div>

            <div className="mg-body">
                {loading ? (
                    <div className="mg-loading">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="mg-empty">
                        <p>No grievances found. <button onClick={() => navigate("/student/file-grievance")} className="mg-link">File a grievance</button></p>
                    </div>
                ) : (
                    <>
                        <div className="mg-grid">
                            {current.map((g) => (
                                <div key={g._id || g.trackingId} className="mg-card">
                                    <div className="mg-card-top">
                                        <div className="mg-title">{g.title}</div>
                                        <div className={`mg-badge ${(g.status || "").toLowerCase().replace(" ", "-")}`}>
                                            {g.status || "Pending"}
                                        </div>
                                    </div>

                                    <div className="mg-meta">
                                        <div><strong>Tracking:</strong> {g.trackingId || "N/A"}</div>
                                        <div><strong>Priority:</strong> {g.priority || "Medium"}</div>
                                        <div><strong>Dept:</strong> {g.department?.name || (typeof g.department === "string" ? g.department : "N/A")}</div>
                                    </div>

                                    <p className="mg-desc">{g.description ? (g.description.length > 120 ? g.description.slice(0, 120) + "..." : g.description) : ""}</p>

                                    <div className="mg-footer">
                                        <div className="mg-date">{new Date(g.updatedAt || g.createdAt).toLocaleString()}</div>
                                        <div className="mg-actions-row">
                                            <button className="mg-view" onClick={() => gotoDetails(g._id, g.trackingId)}>View Details</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* pagination controls */}
                        <div className="mg-pagination">
                            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
                            <div className="mg-page-info">Page {page} / {totalPages}</div>
                            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
