import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LineChart, Line } from "recharts";
import "./SuperAdminDashboard.css";

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({});
    const [statusData, setStatusData] = useState([]);
    const [deptData, setDeptData] = useState([]);
    const [trendData, setTrendData] = useState([]);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF4F4F"];

    const getHeaders = () => ({
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const res1 = await api.get("/superadmin/stats", { headers: getHeaders() });
            const res2 = await api.get("/superadmin/grievances-by-status", { headers: getHeaders() });
            const res3 = await api.get("/superadmin/grievances-by-dept", { headers: getHeaders() });
            const res4 = await api.get("/superadmin/grievances-trend", { headers: getHeaders() });

            setStats(res1.data);
            setStatusData(res2.data);
            setDeptData(res3.data);
            setTrendData(res4.data);
        } catch (err) {
            console.error("Dashboard loading error:", err);
        }
    };

    return (
        <div className="sa-dashboard">
            <h1 className="sa-title">SuperAdmin Dashboard</h1>

            {/* Top Cards */}
            <div className="sa-cards">
                <div className="sa-card">
                    <h3>Total Grievances</h3>
                    <p>{stats.totalGrievances || 0}</p>
                </div>

                <div className="sa-card">
                    <h3>Pending</h3>
                    <p className="yellow">{stats.pending || 0}</p>
                </div>

                <div className="sa-card">
                    <h3>Resolved</h3>
                    <p className="green">{stats.resolved || 0}</p>
                </div>

                <div className="sa-card">
                    <h3>Total Students</h3>
                    <p>{stats.totalStudents || 0}</p>
                </div>

                <div className="sa-card">
                    <h3>Total Admins</h3>
                    <p>{stats.totalAdmins || 0}</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="sa-charts">

                {/* Status Pie */}
                <div className="sa-chart-card">
                    <h3>Status Breakdown</h3>
                    <PieChart width={350} height={300}>
                        <Pie
                            data={statusData}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {statusData.map((entry, idx) => (
                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                {/* Department Bar Chart */}
                <div className="sa-chart-card">
                    <h3>Grievances by Department</h3>
                    <BarChart width={450} height={300} data={deptData}>
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#0088FE" />
                    </BarChart>
                </div>

                {/* Trend Line Chart */}
                <div className="sa-chart-card">
                    <h3>Grievance Trend (Last 30 days)</h3>
                    <LineChart width={550} height={300} data={trendData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="count" stroke="#00C49F" strokeWidth={2} />
                    </LineChart>
                </div>

            </div>

            {/* System overview */}
            <div className="sa-overview">
                <h3>Quick Insights</h3>
                <div className="overview-grid">

                    <div className="ov-box">
                        <h4>Most Active Department</h4>
                        <p>{stats.mostActiveDept || "N/A"}</p>
                    </div>

                    <div className="ov-box">
                        <h4>Average Resolution Time</h4>
                        <p>{stats.avgResolutionTime || "0"} hrs</p>
                    </div>

                    <div className="ov-box">
                        <h4>SLA Violations</h4>
                        <p className="red">{stats.slaBreaches || 0}</p>
                    </div>

                </div>
            </div>

        </div>
    );
}
