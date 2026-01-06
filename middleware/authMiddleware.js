import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔐 Protect middleware
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("assignedSociety")
      .populate({
        path: "flat",
        populate: {
          path: "block",
          populate: { path: "society" }
        }
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach society
    user.society = user.assignedSociety || user.flat?.block?.society;

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed"
    });
  }
};

// 🔒 Admin-only middleware  ✅ THIS WAS MISSING
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Admins only."
  });
};
