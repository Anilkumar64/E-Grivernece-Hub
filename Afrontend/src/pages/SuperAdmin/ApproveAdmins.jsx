import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

function ApproveAdmins() {
    const [pendingAdmins, setPendingAdmins] = useState([]);

    const fetchPendingAdmins = async () => {
        try {
            const res = await axios.get("/api/admin/pending", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"), // must be superadmin
                },
            });
            setPendingAdmins(res.data);
        } catch (err) {
            toast.error("Failed to load pending admins");
        }
    };

    const approveAdmin = async (id) => {
        try {
            await axios.patch(`/api/admin/approve/${id}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });

            toast.success("Admin approved");
            fetchPendingAdmins();
        } catch (err) {
            toast.error("Approval failed");
        }
    };

    const rejectAdmin = async (id) => {
        try {
            await axios.delete(`/api/admin/reject/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });

            toast.success("Admin rejected and removed");
            fetchPendingAdmins();
        } catch (err) {
            toast.error("Rejection failed");
        }
    };

    useEffect(() => {
        fetchPendingAdmins();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Pending Admin Approvals</h1>

            {pendingAdmins.length === 0 && (
                <p>No pending admins 🎉</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pendingAdmins.map((admin) => (
                    <div
                        key={admin._id}
                        className="border p-4 rounded shadow bg-white"
                    >
                        <h3 className="text-lg font-bold mb-2">{admin.name}</h3>

                        <p><strong>Email:</strong> {admin.email}</p>
                        <p><strong>Staff ID:</strong> {admin.staffId}</p>
                        <p><strong>Department:</strong> {admin.department}</p>
                        <p><strong>Applied On:</strong> {new Date(admin.createdAt).toLocaleString()}</p>

                        {admin.idCardFile && (
                            <div className="mt-3">
                                <p><strong>ID Card:</strong></p>
                                <img
                                    src={admin.idCardFile}
                                    alt="ID Card"
                                    className="w-48 border rounded"
                                />
                            </div>
                        )}

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => approveAdmin(admin._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => rejectAdmin(admin._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ApproveAdmins;
