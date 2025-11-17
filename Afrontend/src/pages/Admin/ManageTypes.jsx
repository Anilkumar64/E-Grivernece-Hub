import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

function ManageComplaintTypes() {
    const [types, setTypes] = useState([]);
    const [newType, setNewType] = useState("");

    const fetchTypes = async () => {
        try {
            const res = await axios.get("/api/complaints/type/all", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });
            setTypes(res.data);
        } catch (err) {
            toast.error("Failed to load complaint types");
        }
    };

    const createType = async () => {
        if (!newType.trim()) return toast.warning("Enter type name");

        try {
            await axios.post(
                "/api/complaints/type/create",
                { name: newType },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("adminToken"),
                    },
                }
            );
            toast.success("Complaint type added");
            setNewType("");
            fetchTypes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add type");
        }
    };

    const deleteType = async (id) => {
        try {
            await axios.delete(`/api/complaints/type/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("adminToken"),
                },
            });

            toast.success("Type deleted");
            fetchTypes();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Complaint Types</h1>

            {/* Add Type */}
            <div className="flex gap-2 mb-6">
                <input
                    className="border p-2 rounded w-full"
                    placeholder="Enter complaint type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                />
                <button
                    onClick={createType}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>

            {/* List */}
            <div className="border p-4 rounded">
                <h2 className="text-lg font-semibold mb-3">Existing Types</h2>

                {types.length === 0 && <p>No complaint types found.</p>}

                {types.map((t) => (
                    <div
                        key={t._id}
                        className="flex justify-between items-center border-b py-2"
                    >
                        <p>{t.name}</p>
                        <button
                            onClick={() => deleteType(t._id)}
                            className="text-red-600 font-semibold"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ManageComplaintTypes;
