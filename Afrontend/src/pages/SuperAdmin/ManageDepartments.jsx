
import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

function ManageDepartments() {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState("");

    // Fetch departments
    const fetchDepartments = async () => {
        try {
            const res = await axios.get("/api/superadmin/department/all", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });
            setDepartments(res.data);
        } catch (error) {
            toast.error("Failed to load departments");
        }
    };

    // Add department
    const handleAdd = async () => {
        if (!newDepartment.trim()) {
            toast.warn("Department name required");
            return;
        }

        try {
            await axios.post(
                "/api/superadmin/department/create",
                { name: newDepartment },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("adminToken"),
                    },
                }
            );

            toast.success("Department added");
            setNewDepartment("");
            fetchDepartments();
        } catch (error) {
            toast.error("Failed to add department");
        }
    };

    // Delete department
    const deleteDept = async (id) => {
        try {
            await axios.delete(`/api/superadmin/department/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });

            toast.success("Department deleted");
            fetchDepartments();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">Manage Departments</h1>

            {/* Add Department */}
            <div className="bg-white p-4 shadow rounded mb-6 flex gap-3 items-center">
                <input
                    type="text"
                    placeholder="Enter department name..."
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="border p-2 flex-1 rounded"
                />
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Department
                </button>
            </div>

            {/* Department List */}
            <div>
                <h2 className="text-xl font-semibold mb-3">All Departments</h2>

                {departments.length === 0 && <p>No departments found</p>}

                <ul className="space-y-3">
                    {departments.map((dept) => (
                        <li
                            key={dept._id}
                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                        >
                            <span className="font-medium">{dept.name}</span>

                            <button
                                onClick={() => deleteDept(dept._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default ManageDepartments;
