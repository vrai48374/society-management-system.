import express from "express";
import {
  createSociety,
  getAllSocieties,
  getSocietyById,
  updateSociety,
  deleteSociety,
  getSocietyWithBlocks,
  getSocietyDetails,
} from "../controllers/society.controller.js";

import {
  protect,
  adminOnly,
  superAdminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ONLY SUPERADMIN
router.post("/", protect, superAdminOnly, createSociety);
router.delete("/:id", protect, superAdminOnly, deleteSociety);

//  ADMIN + SUPERADMIN
router.get("/", protect, adminOnly, getAllSocieties);
router.get("/:id", protect, adminOnly, getSocietyById);
router.put("/:id", protect, adminOnly, updateSociety);
router.get("/:id/with-details", protect, adminOnly, getSocietyWithBlocks);
router.get("/:id/details", protect, adminOnly, getSocietyDetails);

export default router;
