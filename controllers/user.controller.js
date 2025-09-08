import User from "../models/User.js";
import Flat from "../models/Flat.js";
import Block from "../models/Block.js";
import Society from "../models/Society.js";

// BASIC USER FUNCTIONS

// Get logged-in user profile
// controllers/user.controller.js
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "flat",
        populate: {
          path: "block",
          populate: {
            path: "society",
            select: "name address"
          },
          select: "name"
        },
        select: "number"
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};


// Get all users (admin only)

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
    next(err); // Pass error to errorHandler middleware
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

//  FULL LINKAGE FUNCTION 

export const assignUserFullLinkage = async (req, res) => {
  try {
    const { userId, flatId } = req.body;

    // Check user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    //  Check flat
    const flat = await Flat.findById(flatId).populate({
      path: "block",
      populate: { path: "society" }
    });
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });

    const block = flat.block;
    if (!block) return res.status(404).json({ success: false, message: "Block not found" });

    const society = block.society;
    if (!society) return res.status(404).json({ success: false, message: "Society not found" });

    //  Link user ↔ flat
    user.flat = flat._id;
    await user.save();
    if (!flat.residents.includes(user._id)) {
  flat.residents.push(user._id);
}


    flat.owner = user._id;
    await flat.save();

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
    next(error); // Pass error to errorHandler middleware
  }
};

// Get User with full linkage details
export const getUserFullDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "flat",
        populate: {
          path: "block",
          populate: {
            path: "society"
          }
        }
      });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err); // Pass error to errorHandler middleware
  }
};
// controllers/user.controller.js
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role } = req.query;

    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};


