import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Populate assignedSociety to get society details
    const user = await User.findOne({ email }).select("+password").populate('assignedSociety');
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }
    
    const token = generateToken(user._id);
    
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    // Include assignedSociety in the response
    res.json({
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        assignedSociety: user.assignedSociety // Now includes society data
      },
      token
    });
  } catch (err) {
    next(err);
  }
};

// Optionally, update the register function similarly if needed
// REGISTER
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Populate assignedSociety after creation if needed, but typically not set during registration
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

//  LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
