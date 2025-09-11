import Notice from "../models/Notice.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

// controllers/notice.controller.js
export const createNotice = async (req, res, next) => {
  try {
    const { title, message, societyId } = req.body;

    // Verify user has permissions for this society
    if (req.user.role !== "superadmin" && req.user.society.toString() !== societyId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to create notices for this society"
      });
    }

    const residents = await User.find({ 
      role: "resident", 
      society: societyId 
    }).select("email");

    // (remaining code unchanged)
  } catch (err) {
    next(err);
  }
};

// Get all notices for a society
export const getNoticesBySociety = async (req, res, next) => {
  try {
    const { societyId } = req.params;
    const notices = await Notice.find({ society: societyId }).populate("createdBy", "name email role");
    res.json({ success: true, data: notices });
  } catch (err) {
    next(err);
  }
};
