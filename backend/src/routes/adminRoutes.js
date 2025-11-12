import express from "express";
import upload from "../middleware/upload.js";
import {
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
} from "../controllers/adminController.js";

import {
    loginAdmin,
    refreshAccessToken,
    logoutAdmin,
} from "../controllers/authController.js";

import { verifyToken, verifySuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------------------------------
 🔐 AUTHENTICATION ROUTES
------------------------------------------------------------------ */

// 🧾 Register a new admin (with ID card upload)
router.post("/register", upload.single("idCardFile"), registerAdmin);

// 🧠 Login (for both verified Admins and SuperAdmin)
router.post("/login", loginAdmin);

// 🔁 Refresh access token
router.post("/refresh", refreshAccessToken);

// 🚪 Logout
router.post("/logout", verifyToken, logoutAdmin);

/* ------------------------------------------------------------------
 👑 SUPER ADMIN MANAGEMENT ROUTES
------------------------------------------------------------------ */

// Get all pending (unverified) admins
router.get("/pending", verifySuperAdmin, getPendingAdmins);

// Approve admin account
router.patch("/approve/:id", verifySuperAdmin, approveAdmin);

// Reject admin registration
router.delete("/reject/:id", verifySuperAdmin, rejectAdmin);

/* ------------------------------------------------------------------
 👤 ADMIN PROFILE
------------------------------------------------------------------ */

// Get current admin profile
router.get("/me", verifyToken, async (req, res) => {
    try {
        res.status(200).json({
            message: "Admin profile fetched successfully",
            admin: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
                department: req.admin.department,
                role: req.admin.role,
                verified: req.admin.verified,
            },
        });
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
