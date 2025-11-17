import express from "express";
import upload from "../middleware/upload.js";
import {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} from "../controllers/userController.js";

const router = express.Router();

// Add multer here
router.post("/signup", upload.single("idCard"), registerUser);

router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;
