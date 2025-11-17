import React, { useState } from "react";
import "./Login.css";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/users/login", { email, password });

            toast.success("Login successful!");

            // Save JWT token
            localStorage.setItem("token", res.data.token);

            // Redirect user based on role
            if (res.data.user.role === "student") navigate("/student/dashboard");
            else if (res.data.user.role === "staff") navigate("/staff/dashboard");
            else navigate("/");

        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">
                <h2>Welcome Back 👋</h2>
                <p className="subtitle">Sign in to continue</p>

                <form onSubmit={handleLogin}>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">
                        Login
                    </button>

                </form>

                <div className="extra-links">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>

                <p className="signup-text">
                    Don’t have an account? <Link to="/signup">Create one</Link>
                </p>
            </div>

        </div>
    );
};

export default Login;
