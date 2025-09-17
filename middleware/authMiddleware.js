import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user and populate both the direct and nested paths for the society
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate('assignedSociety') // Path for Admins
      .populate({                 // Path for Residents
        path: "flat",
        populate: {
          path: "block",
          populate: {
            path: "society"
          },
        },
      });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    // This one line now handles both Admins and Residents
    // It creates a new 'society' property on the user object for easy access
    user.society = user.assignedSociety || user.flat?.block?.society;
    
    req.user = user;
    next();
  } catch (error) {
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
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};
