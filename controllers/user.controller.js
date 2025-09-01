import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

// 🔹 Admin: Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(StatusCodes.OK).json(users);
};

// 🔹 Resident: Get own profile
export const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(StatusCodes.OK).json(user);
};

// 🔹 Admin: Create user
export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.status(StatusCodes.CREATED).json(user);
};

// 🔹 Update user (Admin can update anyone, Resident can update only self)
export const updateUser = async (req, res) => {
  const { id } = req.params;

  // if resident, force update only their own id
  if (req.user.role === "resident" && req.user.id !== id) {
    return res.status(StatusCodes.FORBIDDEN).json({ message: "Not allowed" });
  }

  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
  }

  res.status(StatusCodes.OK).json(user);
};

// 🔹 Delete user (Admin only)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
  }

  res.status(StatusCodes.OK).json({ message: "User deleted" });
};

// get user by id
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
  }

  res.status(StatusCodes.OK).json(user);
};

