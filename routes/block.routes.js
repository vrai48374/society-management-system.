import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createBlock, getBlocksBySociety,getBlockWithFlats, } from "../controllers/block.controller.js";

const router = express.Router();

// 🔹 Create Block (Admin only)
router.post("/", protect, authorize("admin", "superadmin"), createBlock);

// 🔹 Get all Blocks of a Society
router.get("/:societyId", protect, getBlocksBySociety);

// 🔹 Get Block with Flats
router.get("/details/:id", protect, getBlockWithFlats);

export default router;
