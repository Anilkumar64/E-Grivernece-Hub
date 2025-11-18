import React, { useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminLogin() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/api/admin/login", form);

            localStorage.setItem("adminToken", res.data.accessToken);
            toast.success("Login successful");

            navigate("/admin/dashboard");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="border p-6 rounded shadow w-96"
            >
                <h1 className="text-xl font-bold mb-4">Admin Login</h1>

                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3 rounded"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2 w-full mb-3 rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default AdminLogin;
