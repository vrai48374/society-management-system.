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

// Only admin can manage societies
router.post("/", protect, authorize("admin"), createSociety);
router.get("/", protect, authorize("admin"), getAllSocieties);
router.get("/:id", protect, authorize("admin"), getSocietyById);
router.put("/:id", protect, authorize("admin"), updateSociety);
router.delete("/:id", protect, authorize("admin"), deleteSociety);

export default router;
