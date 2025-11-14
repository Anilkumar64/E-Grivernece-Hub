import express from "express";
import {
    createGrievance,
    getMyGrievances,
    getGrievanceByTrackingId,
    updateGrievanceStatus,
} from "../controllers/grievanceController.js";
import { verifyToken } from "../middleware/authMiddleware.js";



const router = express.Router();

// Student routes
router.post("/create", verifyToken, createGrievance);

router.get("/my", verifyToken, getMyGrievances);
router.get("/:trackingId", verifyToken, getGrievanceByTrackingId);

// Admin route to update status
router.put("/:id/status", verifyToken, updateGrievanceStatus);

export default router;
