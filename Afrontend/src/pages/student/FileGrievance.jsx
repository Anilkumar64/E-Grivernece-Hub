import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import "./FileGrievance.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FileGrievance = () => {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [types, setTypes] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        department: "",
        complaintType: "",
        priority: "Medium",
        isAnonymous: false,
    });

    const [attachments, setAttachments] = useState([]);

    // Load Departments + Complaint Types
    useEffect(() => {
        fetchDepartments();
        fetchTypes();
    }, []);

    const fetchDepartments = async () => {
        try {
            const res = await api.get("/departments");
            setDepartments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTypes = async () => {
        try {
            const res = await api.get("/complaint-types");
            setTypes(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle File Upload
    const handleFileChange = (e) => {
        setAttachments([...e.target.files]);
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("title", form.title);
        data.append("description", form.description);
        data.append("department", form.department);
        data.append("complaintType", form.complaintType);
        data.append("priority", form.priority);
        data.append("isAnonymous", form.isAnonymous);

        attachments.forEach((file) => {
            data.append("attachments", file);
        });

        try {
            const res = await api.post("/grievances", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Grievance Filed Successfully!");
            navigate("/student/dashboard");

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to file grievance");
        }
    };

    return (
        <div className="file-grievance">

            <h2>📝 File New Grievance</h2>

            <form onSubmit={handleSubmit} className="grievance-form">

                {/* Title */}
                <label>Grievance Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Enter grievance title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                {/* Description */}
                <label>Description</label>
                <textarea
                    name="description"
                    placeholder="Explain your issue clearly..."
                    rows="5"
                    value={form.description}
                    onChange={handleChange}
                    required
                ></textarea>

                {/* Department */}
                <label>Department</label>
                <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                </select>

                {/* Complaint Type */}
                <label>Complaint Type</label>
                <select
                    name="complaintType"
                    value={form.complaintType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Complaint Type</option>
                    {types.map((t) => (
                        <option key={t._id} value={t._id}>{t.type}</option>
                    ))}
                </select>

                {/* Priority */}
                <label>Priority</label>
                <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                </select>

                {/* Anonymous */}
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={form.isAnonymous}
                        onChange={handleChange}
                    />
                    File as Anonymous
                </label>

                {/* Attachments */}
                <label>Attachments (Optional)</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />

                <button type="submit" className="submit-btn">Submit Grievance</button>
            </form>

        </div>
    );
};

export default FileGrievance;
