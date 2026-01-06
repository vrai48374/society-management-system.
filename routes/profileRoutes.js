import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route: any logged-in user
router.get("/profile", protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Admin-only route
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({ success: true, message: "Welcome, Admin!" });
});

export default router;
