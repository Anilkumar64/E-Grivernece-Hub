import express from "express";
import {
    createGrievance,
    getMyGrievances,
    getGrievanceByTrackingId,
    updateGrievanceStatus,
} from "../controllers/grievanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student routes
router.post("/", protect, createGrievance);
router.get("/my", protect, getMyGrievances);
router.get("/:trackingId", protect, getGrievanceByTrackingId);

// Admin route to update status
router.put("/:id/status", protect, updateGrievanceStatus);

export default router;
