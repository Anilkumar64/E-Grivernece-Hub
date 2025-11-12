import express from "express";
import upload from "../middleware/upload.js";
import {
    registerAdmin,
    loginAdmin,
    refreshAccessToken,
    logoutAdmin,
} from "../controllers/authController.js";

const router = express.Router();

// 🧾 Register admin (with optional ID card upload)
router.post("/register", upload.single("idCardFile"), registerAdmin);

// 🔐 Login, token refresh, and logout
router.post("/login", loginAdmin);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutAdmin);

export default router;
