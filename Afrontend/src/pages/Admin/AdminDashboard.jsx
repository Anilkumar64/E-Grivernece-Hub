import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [latest, setLatest] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const res = await api.get("/grievances/admin/dashboard", { headers });
            const recent = await api.get("/grievances/admin/latest", { headers });

            setStats(res.data);
            setLatest(recent.data.grievances);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load dashboard");
            console.error(err);
        }
    };

    if (loading) return <div className="loader">Loading Dashboard...</div>;

    const pieData = {
        labels: ["Pending", "In Progress", "Resolved", "Rejected"],
        datasets: [
            {
                data: [
                    stats.counts.pending,
                    stats.counts.inprogress,
                    stats.counts.resolved,
                    stats.counts.rejected,
                ],
                backgroundColor: [
                    "#FFB400",
                    "#006DFF",
                    "#26C485",
                    "#FF3D3D",
                ],
            },
        ],
    };

    const barData = {
        labels: stats.months.map((m) => m.month),
        datasets: [
            {
                label: "Grievances",
                data: stats.months.map((m) => m.count),
                backgroundColor: "#4A90E2",
            },
        ],
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {/* Metrics */}
            <div className="metrics">
                <div className="card yellow">
                    <h3>{stats.counts.total}</h3>
                    <p>Total Grievances</p>
                </div>
                <div className="card blue">
                    <h3>{stats.counts.inprogress}</h3>
                    <p>In Progress</p>
                </div>
                <div className="card green">
                    <h3>{stats.counts.resolved}</h3>
                    <p>Resolved</p>
                </div>
                <div className="card red">
                    <h3>{stats.counts.pending}</h3>
                    <p>Pending</p>
                </div>
            </div>

            {/* Charts */}
            <div className="charts">
                <div className="chart-card">
                    <h4>Status Distribution</h4>
                    <Pie data={pieData} />
                </div>

                <div className="chart-card">
                    <h4>Monthly Complaints</h4>
                    <Bar data={barData} />
                </div>
            </div>

            {/* Latest Grievances */}
            <div className="latest-section">
                <h3>Latest Grievances</h3>

                <table className="latest-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Student</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {latest.map((g) => (
                            <tr key={g._id}>
                                <td>{g.title}</td>
                                <td>{g.userEmail}</td>

                                <td>
                                    <span className={`status ${g.status.replace(" ", "").toLowerCase()}`}>
                                        {g.status}
                                    </span>
                                </td>

                                <td>
                                    <span className={`priority ${g.priority.toLowerCase()}`}>
                                        {g.priority}
                                    </span>
                                </td>

                                <td>{new Date(g.createdAt).toLocaleDateString()}</td>

                                <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate(`/admin/grievance/${g._id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
