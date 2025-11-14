import express from "express";
import { registerUser, verifyOTP, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

export default router;
