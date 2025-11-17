import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminProfile() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await axios.get("/api/admin/me", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });

            setAdmin(res.data.admin);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load profile");
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                "/api/admin/logout",
                { id: admin.id },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("adminToken"),
                    },
                }
            );

            localStorage.removeItem("adminToken");
            toast.success("Logged out");
            navigate("/admin/login");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Admin Profile</h1>

            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Staff ID:</strong> {admin.staffId}</p>
            <p><strong>Department:</strong> {admin.department}</p>
            <p><strong>Role:</strong> {admin.role}</p>
            <p>
                <strong>Status:</strong>{" "}
                {admin.verified ? (
                    <span className="text-green-600 font-semibold">Verified</span>
                ) : (
                    <span className="text-red-600 font-semibold">Not Verified</span>
                )}
            </p>

            {/* ID Card */}
            {admin.idCardFile && (
                <div className="mt-4">
                    <p className="font-semibold mb-2">ID Card:</p>
                    <img
                        src={admin.idCardFile}
                        alt="ID Card"
                        className="border rounded w-60"
                    />
                </div>
            )}

            <button
                onClick={logout}
                className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
            >
                Logout
            </button>
        </div>
    );
}

export default AdminProfile;
