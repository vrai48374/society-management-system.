import express from "express";
import { body, param } from "express-validator";
import { validate } from "../middleware/validateMiddleware.js";

import {
  assignUserFullLinkage,
  getMyProfile,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUserFullDetails,
} from "../controllers/user.controller.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { createSociety } from "../controllers/society.controller.js";

const router = express.Router();

// Resident
router.get("/me", protect, getMyProfile);

// Admin - Get all users
router.get("/", protect, authorize("admin"), getAllUsers);

// Admin/Superadmin - Create user
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("role").isIn(["resident", "admin", "superadmin"]).withMessage("Invalid role"),
  ],
  validate,
  createUser
);

// Update user
router.put(
  "/:id",
  protect,
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Must be a valid email"),
  ],
  validate,
  updateUser
);

// Delete user
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Invalid user ID")],
  validate,
  deleteUser
);

// Get user by ID
router.get(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Invalid user ID")],
  validate,
  getUserById
);

// Assign user to flat
router.post(
  "/assign",
  protect,
  authorize("superadmin", "admin"),
  [
    body("userId").isMongoId().withMessage("Valid userId is required"),
    body("flatId").isMongoId().withMessage("Valid flatId is required"),
  ],
  validate,
  assignUserFullLinkage
);

// Get user with full linkage
router.get(
  "/:id/full",
  protect,
  authorize("admin", "superadmin"),
  [param("id").isMongoId().withMessage("Invalid user ID")],
  validate,
  getUserFullDetails
);

// Only superadmin can create society
router.post(
  "/create",
  protect,
  authorize("superadmin"),
  [body("name").notEmpty().withMessage("Society name is required")],
  validate,
  createSociety
);

export default router;
