import Society from "../models/Society.js";

// controllers/admin.controller.js
import User from "../models/User.js"; // assuming admins are in User collection

// Get all admins
export const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: "admin" }).populate("assignedSociety").select("-password");
    res.status(200).json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
};

// Create admin
export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, societyId } = req.body;

    const adminExists = await User.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin with this email already exists" });

    const admin = await User.create({
      name,
      email,
      password,
      role: "admin",
      assignedSociety: societyId,
    });

    res.status(201).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

// Update admin by ID
export const updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const admin = await User.findById(id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update fields
    if (updates.name) admin.name = updates.name;
    if (updates.email) admin.email = updates.email;
    if (updates.password) admin.password = updates.password; // consider hashing if needed
    if (updates.societyId) admin.assignedSociety = updates.societyId;

    await admin.save();
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

// Delete admin by ID
export const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const admin = await User.findById(id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    await admin.deleteOne();
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateUserBalance = async (req, res) => {
  try {
    const { userId, balance, dueDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.currentBalance = balance;
    user.dueDate = dueDate;
    await user.save();

    res.json({
      success: true,
      message: "Balance updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currentBalance: user.currentBalance,
        dueDate: user.dueDate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
