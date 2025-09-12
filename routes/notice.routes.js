// In your routes file (e.g., routes/notice.js)
import express from "express";
import { createNotice, getNoticesBySociety } from "../controllers/notice.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This route should use the protect middleware
router.post("/", protect, createNotice);
router.get("/society/:societyId", protect, getNoticesBySociety);

export default router;