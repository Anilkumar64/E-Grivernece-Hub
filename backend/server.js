import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";

import ConnectDB from "./home/anilreddy/Documents/E-Griverence Hub/backend/src/Database/ConnectDB.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

// Initialize Express app
const app = express();

/* ------------------------------------------------------------------
   Middleware
------------------------------------------------------------------ */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (only in development)
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

/* ------------------------------------------------------------------
   Static Folder for File Uploads
   Accessible at: /uploads
------------------------------------------------------------------ */
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

/* ------------------------------------------------------------------
   Root Route (Health Check)
------------------------------------------------------------------ */
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        service: "E-Griverence Hub Backend",
        environment: process.env.NODE_ENV || "development",
    });
});

/* ------------------------------------------------------------------
   Database Connection
------------------------------------------------------------------ */
ConnectDB()
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err);
        process.exit(1);
    });

/* ------------------------------------------------------------------
   API Routes
------------------------------------------------------------------ */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/superadmin", superAdminRoutes);

/* ------------------------------------------------------------------
   Error Handlers
------------------------------------------------------------------ */
app.use(notFound);
app.use(errorHandler);

/* ------------------------------------------------------------------
   Start Server
------------------------------------------------------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV || "dev"})`);
});
