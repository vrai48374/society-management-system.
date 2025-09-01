import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route: any logged-in user
router.get("/profile", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Admin-only route
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ success: true, message: "Welcome, Admin!" });
});

export default router;
