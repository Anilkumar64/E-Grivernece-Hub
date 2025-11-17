import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

import { toast } from "react-toastify";

function SuperAdminReports() {
    const [summary, setSummary] = useState(null);
    const [deptData, setDeptData] = useState([]);
    const [statusData, setStatusData] = useState([]);

    const COLORS = ["#0088FE", "#FF8042", "#FFBB28", "#00C49F"];

    const fetchReports = async () => {
        try {
            const res = await axios.get("/api/superadmin/reports", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });

            setSummary(res.data.summary);

            // Format department report for bar chart
            setDeptData(
                res.data.departmentReport.map((d) => ({
                    department: d.department,
                    total: d.count,
                }))
            );

            // Format status report for pie chart
            setStatusData(
                res.data.statusReport.map((s) => ({
                    name: s.status,
                    value: s.count,
                }))
            );
        } catch (error) {
            toast.error("Failed to load reports");
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (!summary) {
        return <p className="p-6">Loading reports...</p>;
    }

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">📊 SuperAdmin Analytics Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <div className="bg-white p-5 shadow rounded-lg">
                    <h2 className="text-gray-500">Total Grievances</h2>
                    <h1 className="text-3xl font-semibold">{summary.totalGrievances}</h1>
                </div>

                <div className="bg-white p-5 shadow rounded-lg">
                    <h2 className="text-gray-500">Resolved</h2>
                    <h1 className="text-3xl font-semibold text-green-600">
                        {summary.resolved}
                    </h1>
                </div>

                <div className="bg-white p-5 shadow rounded-lg">
                    <h2 className="text-gray-500">Avg Resolution Time</h2>
                    <h1 className="text-3xl font-semibold">{summary.avgResolutionTime} hrs</h1>
                </div>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Status Pie Chart */}
                <div className="bg-white p-6 shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Grievance Status Breakdown</h2>

                    <PieChart width={400} height={300}>
                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={120}
                            label
                        >
                            {statusData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>

                {/* Department Bar Chart */}
                <div className="bg-white p-6 shadow rounded-lg">
                    <h2 className="text-lg font-semibold mb-4">Department-wise Grievances</h2>

                    <BarChart width={500} height={300} data={deptData}>
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" fill="#0088FE" name="Total Grievances" />
                    </BarChart>
                </div>

            </div>
        </div>
    );
}

export default SuperAdminReports;
