import express from "express";
import { createNotice, getNoticesBySociety } from "../controllers/notice.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { authorizeSocietyAdmin } from "../middleware/societyAuth.js";


const router = express.Router();

// Only admin/superadmin can create notice
router.post("/", protect, authorizeSocietyAdmin, createNotice);

// Residents & Admin can view notices
router.get("/:societyId", protect, getNoticesBySociety);

export default router;
