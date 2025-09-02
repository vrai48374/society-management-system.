import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createBlock, getBlocksBySociety } from "../controllers/block.controller.js";

const router = express.Router();

// 🔹 Create Block (Admin only)
router.post("/", protect, authorize("admin", "superadmin"), createBlock);

// 🔹 Get all Blocks of a Society
router.get("/:societyId", protect, getBlocksBySociety);

export default router;
