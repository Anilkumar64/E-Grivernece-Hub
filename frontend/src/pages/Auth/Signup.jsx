import React, { useState } from "react";
// import "..styles/Signup.css";
import api from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        studentId: "",
        department: "",
        phone: "",
        yearOfStudy: "",
    });

    const [idCard, setIdCard] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (e) => {
        setIdCard(e.target.files[0]);
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            Object.keys(form).forEach((key) => formData.append(key, form[key]));
            if (idCard) formData.append("idCard", idCard);

            const res = await api.post("/users/signup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Signup successful! Verify OTP.");
            navigate("/verify-otp?email=" + form.email);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="signup-container">

            <form className="signup-box" onSubmit={handleSignup}>
                <h2>Create Account</h2>

                <div className="input-group">
                    <label>Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="input-group">
                    <label>Email</label>
                    <input name="email" value={form.email} onChange={handleChange} type="email" required />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input name="password" value={form.password} onChange={handleChange} type="password" required />
                </div>

                <div className="input-group">
                    <label>Student ID</label>
                    <input name="studentId" value={form.studentId} onChange={handleChange} />
                </div>

                <div className="input-group">
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div className="input-group">
                    <label>Year of Study</label>
                    <input name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange} />
                </div>

                <div className="input-group">
                    <label>Department</label>
                    <select name="department" value={form.department} onChange={handleChange}>
                        <option value="">Select Department</option>
                        <option value="IT">Information Technology</option>
                        <option value="CSE">Computer Engineering</option>
                        <option value="ECE">Electronics</option>
                        <option value="EEE">Electrical</option>
                        <option value="MECH">Mechanical</option>
                        <option value="CIVIL">Civil</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>ID Card Upload</label>
                    <input type="file" onChange={handleFile} accept="image/*" />
                </div>

                <button className="btn-submit" type="submit">Signup</button>

                <p className="have-account">
                    Already have an account? <span onClick={() => navigate("/login")}>Login</span>
                </p>
            </form>
        </div>
    );
};

export default Signup;
