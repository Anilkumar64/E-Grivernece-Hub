import React, { useEffect, useState } from "react";
import "./StudentDashboard.css";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
        fetchMyGrievances();
    }, []);

    // Fetch logged-in user
    const fetchUser = async () => {
        try {
            const res = await api.get("/users/me");
            setUser(res.data.user);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch student's grievances
    const fetchMyGrievances = async () => {
        try {
            const res = await api.get("/grievances/my");
            setGrievances(res.data);
        } catch (err) {
            console.error("Error fetching grievances:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-dashboard">

            {/* Welcome Section */}
            <div className="welcome-box">
                <h2>Hi, {user?.name} 👋</h2>
                <p>Welcome to the E-Grievance Portal</p>

                <div className="user-info">
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Student ID:</strong> {user?.studentId}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button onClick={() => navigate("/student/file-grievance")}>📝 File New Grievance</button>
                <button onClick={() => navigate("/student/grievances")}>📄 My Grievances</button>
                <button onClick={() => navigate("/student/track")}>🔍 Track Complaint</button>
            </div>

            {/* Recent Complaints */}
            <h3 className="recent-title">Recent Complaints</h3>

            {loading ? (
                <p>Loading...</p>
            ) : grievances.length === 0 ? (
                <p>No complaints filed yet.</p>
            ) : (
                <div className="complaint-list">
                    {grievances.map((g) => (
                        <div className="complaint-card" key={g._id}>
                            <h4>{g.title}</h4>
                            <p>{g.description.substring(0, 60)}...</p>

                            <div className={`status-badge ${g.status.replace(" ", "-").toLowerCase()}`}>
                                {g.status}
                            </div>

                            <button
                                className="view-btn"
                                onClick={() => navigate(`/student/grievance/${g._id}`)}
                            >
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default StudentDashboard;
