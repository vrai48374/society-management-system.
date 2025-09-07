import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createFlat, getFlatsByBlock,getFlatsBySociety, } from "../controllers/flat.controller.js";

const router = express.Router();

//  Create Flat (Admin only)
router.post("/", protect, authorize("admin", "superadmin"), createFlat);

//  Get all Flats of a Block
router.get("/:blockId", protect, getFlatsByBlock);

//  Get flats with 
router.get("/society/:societyId", protect, getFlatsBySociety);

export default router;
