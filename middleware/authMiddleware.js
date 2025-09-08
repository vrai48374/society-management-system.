// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id)
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

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found, token invalid" });
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ success: false, message: "Not authorized, token failed" });
  }
};

// 🔹 Middleware: Role-based authorization
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  };
};
