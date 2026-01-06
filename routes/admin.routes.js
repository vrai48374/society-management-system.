import express from "express";
import { body, param } from "express-validator";
import { validate } from "../middleware/validateMiddleware.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

import { 
  createAdmin, 
  getAllAdmins, 
  updateAdmin, 
  deleteAdmin 
} from "../controllers/admin.controller.js";
import {  adminOnly } from "../middleware/authMiddleware.js";
import { updateUserBalance } from "../controllers/admin.controller.js";

const router = express.Router();

// Create admin
router.post(
  "/create-admin",
  protect,
  authorize("superadmin"),
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("societyId").isMongoId(),
  ],
  validate,
  createAdmin
);

// Get all admins
router.get("/admins", protect, authorize("superadmin"), getAllAdmins);

// Update admin by ID
router.put(
  "/:id",
  protect,
  authorize("superadmin"),
  [
    param("id").isMongoId().withMessage("Invalid admin ID"),
    body("name").optional().notEmpty(),
    body("email").optional().isEmail(),
    body("password").optional().isLength({ min: 6 }),
    body("societyId").optional().isMongoId(),
  ],
  validate,
  updateAdmin
);

// Delete admin by ID
router.delete(
  "/:id",
  protect,
  authorize("superadmin"),
  [param("id").isMongoId().withMessage("Invalid admin ID")],
  validate,
  deleteAdmin
);
router.put("/update-balance", protect, adminOnly, updateUserBalance);

export default router;
