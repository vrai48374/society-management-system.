// routes/superadminRoutes.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Create Super Admin (only if none exists)
router.post("/superadmin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if a superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ success: false, message: "Superadmin already exists" });
    }

    const superAdmin = await User.create({
      name,
      email,
      password,
      role: "superadmin",
    });

    res.status(201).json({
      success: true,
      message: "Superadmin created successfully",
      user: { id: superAdmin._id, email: superAdmin.email, role: superAdmin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
