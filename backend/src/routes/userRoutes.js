import express from "express";
import { registerUser, rverifyOTP, loginUser } from "../controllers/userController.js";

import {
    forgotPassword,
    verifyResetOTP,
    resetPassword,
} from "../controllers/userController.js";
const router = express.Router();

router.post("/signup", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

export default router;
