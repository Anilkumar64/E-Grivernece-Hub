import React, { useState } from "react";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AdminSignup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        staffId: "",
        department: "",
        password: "",
    });

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", form.name);
        data.append("email", form.email);
        data.append("staffId", form.staffId);
        data.append("department", form.department);
        data.append("password", form.password);
        if (file) data.append("idCardFile", file);

        try {
            await axios.post("/api/admin/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Admin request submitted. Pending approval.");
            navigate("/admin/login");

        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <form
                onSubmit={handleSignup}
                className="w-96 border p-6 rounded shadow"
            >
                <h1 className="text-xl font-bold mb-4">Admin Signup</h1>

                <input className="border p-2 w-full mb-3 rounded"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                />

                <input className="border p-2 w-full mb-3 rounded"
                    name="email"
                    placeholder="College Email (.ac.in)"
                    value={form.email}
                    onChange={handleChange}
                />

                <input className="border p-2 w-full mb-3 rounded"
                    name="staffId"
                    placeholder="Staff ID"
                    value={form.staffId}
                    onChange={handleChange}
                />

                <input className="border p-2 w-full mb-3 rounded"
                    name="department"
                    placeholder="Department"
                    value={form.department}
                    onChange={handleChange}
                />

                <input className="border p-2 w-full mb-3 rounded"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="border p-2 w-full mb-3 rounded"
                />

                <button className="bg-green-600 text-white w-full py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default AdminSignup;
