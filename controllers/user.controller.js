import User from "../models/User.js";
import Flat from "../models/Flat.js";
import Block from "../models/Block.js";
import Society from "../models/Society.js";

// ====================== BASIC USER FUNCTIONS ======================

// Get logged-in user profile
export const getMyProfile = async (req, res) => {
  res.status(200).json(req.user);
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

// Get single user by ID (admin only)
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

// Create user (admin/superadmin)
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user (admin only)
export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ message: "User deleted" });
};

// ====================== FULL LINKAGE FUNCTION ======================

// Assign user → flat → block → society
export const assignUserFullLinkage = async (req, res) => {
  try {
    const { userId, flatId, blockId, societyId } = req.body;

    // 🔹 Check user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 🔹 Check flat
    const flat = await Flat.findById(flatId);
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });

    // 🔹 Check block
    const block = await Block.findById(blockId);
    if (!block) return res.status(404).json({ success: false, message: "Block not found" });

    // 🔹 Check society
    const society = await Society.findById(societyId);
    if (!society) return res.status(404).json({ success: false, message: "Society not found" });

    // ✅ Link user ↔ flat
    user.flat = flat._id;
    await user.save();

    flat.owner = user._id;
    flat.block = block._id;
    await flat.save();

    // ✅ Link block ↔ society
    if (!block.society) {
      block.society = society._id;
      await block.save();
    }

    if (!society.blocks.includes(block._id)) {
      society.blocks.push(block._id);
      await society.save();
    }

    res.status(200).json({
      success: true,
      message: "User assigned → Flat → Block → Society successfully",
      data: {
        user: user._id,
        flat: flat._id,
        block: block._id,
        society: society._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
