import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔹 Middleware: Protect routes (Authentication)
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found, token invalid" });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// 🔹 Middleware: Role-based access (Authorization)
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    console.log("👉 User role from token:", req.user.role);
    console.log("👉 Allowed roles:", allowedRoles);
    console.log("👉 Resident ID from token:", req.user._id);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next(); // User has allowed role, continue
  };
};
