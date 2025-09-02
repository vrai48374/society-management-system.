import express from "express";
import { 
  createSociety, 
  getAllSocieties, 
  getSocietyById, 
  updateSociety, 
  deleteSociety 
} from "../controllers/society.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only super admin can manage societies
router.post("/", protect, authorize("superadmin"), createSociety);
router.get("/", protect, authorize("superadmin"), getAllSocieties);
router.get("/:id", protect, authorize("superadmin"), getSocietyById);
router.put("/:id", protect, authorize("superadmin"), updateSociety);
router.delete("/:id", protect, authorize("superadmin"), deleteSociety);


export default router;
