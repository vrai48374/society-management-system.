import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔹 Middleware: Protect routes (Authentication)
export const protect = async (req, res, next) => {
  // 1️⃣ Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1]; // Extract the JWT

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Get user info from DB (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    // ✅ User is authenticated, continue
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
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next(); // User has allowed role, continue
  };
};
