import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createFlat, getFlatsByBlock,getFlatWithUser, } from "../controllers/flat.controller.js";

const router = express.Router();

// 🔹 Create Flat (Admin only)
router.post("/", protect, authorize("admin", "superadmin"), createFlat);

// 🔹 Get all Flats of a Block
router.get("/:blockId", protect, getFlatsByBlock);

// 🔹 Get Flat with User
router.get("/details/:id", protect, getFlatWithUser);

export default router;
