import express from "express";
import { 
  createSociety, 
  getAllSocieties, 
  getSocietyById, 
  updateSociety, 
  deleteSociety ,
  getSocietyWithBlocks,
  getSocietyDetails,
} from "../controllers/society.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only super admin can manage societies
router.post("/", protect, authorize("superadmin"), createSociety);
router.get("/", protect, authorize("superadmin"), getAllSocieties);
router.get("/:id", protect, authorize("superadmin"), getSocietyById);
router.put("/:id", protect, authorize("superadmin"), updateSociety);
router.delete("/:id", protect, authorize("superadmin"), deleteSociety);
router.get("/:id/with-details", protect, authorize("superadmin"), getSocietyWithBlocks);
router.get("/:id/details", protect, authorize("superadmin", "admin"), getSocietyDetails);
export default router;
