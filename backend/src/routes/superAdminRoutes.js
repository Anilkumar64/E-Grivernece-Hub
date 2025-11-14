import express from "express";
import { verifySuperAdmin } from "../middleware/authMiddleware.js";
import {
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
} from "../controllers/adminController.js";

const router = express.Router();


router.get("/pending", verifySuperAdmin, getPendingAdmins);
router.patch("/approve/:id", verifySuperAdmin, approveAdmin);
router.delete("/reject/:id", verifySuperAdmin, rejectAdmin);

export default router;
