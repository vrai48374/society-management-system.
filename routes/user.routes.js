import express from "express";

import {assignUserFullLinkage,getMyProfile,getAllUsers,createUser,updateUser,deleteUser,getUserById } from "../controllers/user.controller.js";

import { register,login,logout } from "../controllers/authController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Resident
router.get("/me", protect, getMyProfile);

// Admin
router.get("/", protect, authorize("admin"), getAllUsers);
router.post("/", protect, authorize("admin","superadmin"), createUser);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

// ✅ Get user by ID (admin only)
router.get("/:id", protect, authorize("admin"), getUserById);

// ✅ Assign user to flat
router.post("/assign", protect, authorize("superadmin", "admin"), assignUserFullLinkage);

export default router;
