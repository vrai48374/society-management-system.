import express from "express";
import { 
  getAllUsers, 
  getMyProfile, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserById 
} from "../controllers/user.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resident
router.get("/me", protect, getMyProfile);

// Admin
router.get("/", protect, authorize("admin"), getAllUsers);
router.post("/", protect, authorize("admin"), createUser);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// ✅ Get user by ID (admin only)
router.get("/:id", protect, authorize("admin"), getUserById);

export default router;
