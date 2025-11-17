import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminGrievances.css";

export default function AdminGrievances() {
    const navigate = useNavigate();
    const [grievances, setGrievances] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/grievances/admin/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = res?.data?.grievances || res?.data || [];
            setGrievances(data);
            setFiltered(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch grievances");
        } finally {
            setLoading(false);
        }
    };

    // 🔍 Search + Filters
    useEffect(() => {
        let g = [...grievances];

        // search by trackingId or title
        if (search.trim()) {
            g = g.filter(
                (x) =>
                    x.trackingId.toLowerCase().includes(search.toLowerCase()) ||
                    x.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (statusFilter) {
            g = g.filter((x) => x.status === statusFilter);
        }

        if (priorityFilter) {
            g = g.filter((x) => x.priority === priorityFilter);
        }

        if (sortOrder === "newest") {
            g.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else {
            g.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        setFiltered(g);
    }, [search, statusFilter, priorityFilter, sortOrder, grievances]);

    if (loading) return <div className="ag-loading">Loading...</div>;

    return (
        <div className="admin-grievances-page">
            <h1>Admin Dashboard – Grievances</h1>

            {/* FILTER BAR */}
            <div className="ag-filters">
                <input
                    type="text"
                    placeholder="Search by Tracking ID or Title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* TABLE */}
            <div className="ag-table-wrapper">
                <table className="ag-table">
                    <thead>
                        <tr>
                            <th>Tracking ID</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Submitted By</th>
                            <th>Created</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((g) => (
                            <tr
                                key={g._id}
                                onClick={() => navigate(`/admin/grievance/${g._id}`)}
                            >
                                <td>{g.trackingId}</td>
                                <td>{g.title}</td>

                                <td>
                                    <span className={`ag-badge status-${g.status.replace(" ", "").toLowerCase()}`}>
                                        {g.status}
                                    </span>
                                </td>

                                <td>
                                    <span className={`ag-badge pri-${g.priority.toLowerCase()}`}>
                                        {g.priority}
                                    </span>
                                </td>

                                <td>{g.userEmail}</td>

                                <td>{new Date(g.createdAt).toLocaleString()}</td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan="6" className="ag-empty">
                                    No grievances found ✨
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
