import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import ConnectDB from "./src/Database/ConnectDB.js";
import adminRoutes from "./src/routes/adminRoutes.js"
import authRoutes from "./src/routes/authRoutes.js";
import grievanceRoutes from "./src/routes/grievanceRoutes.js";
import complaintTypeRoutes from "./src/routes/complaintTypeRoutes.js";

import departmentRoutes from "./src/routes/departmentRoutes.js";


import notificationRoutes from "./src/routes/notificationRoutes.js";
import superAdminRoutes from "./src/routes/superAdminRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
// import path from "path";
import userRoutes from "./src/routes/userRoutes.js";


dotenv.config();


const app = express();

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}
const __dirname = path.resolve();

// Serve files statically
app.use("/api/departments", departmentRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/complaint-types", complaintTypeRoutes);

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        status: "ok",
        service: "E-Griverence Hub Backend",
        environment: process.env.NODE_ENV || "development",
    });
});

ConnectDB()
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    });

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || "dev"})`);
});
