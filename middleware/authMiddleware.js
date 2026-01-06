import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Token failed" });
  }
};

// Admin or Superadmin
export const adminOnly = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admins only" });
};

// ONLY Superadmin
export const superAdminOnly = (req, res, next) => {
  if (req.user.role === "superadmin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Superadmin only"
  });
};
