import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { createFlat, getFlatsByBlock,getFlatsBySociety, deleteFlat} from "../controllers/flat.controller.js";

const router = express.Router();

//  Create Flat (Admin only)
router.post("/", protect, authorize("admin", "superadmin"), createFlat);

//  Get flats with 
router.get("/society/:societyId", protect, getFlatsBySociety);

//  Get all Flats of a Block
router.get("/:blockId", protect, getFlatsByBlock);
//  Delete Flat (Admin only)
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteFlat);

export default router;
