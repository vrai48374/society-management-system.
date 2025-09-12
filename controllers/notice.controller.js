import Notice from "../models/Notice.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

// controllers/notice.controller.js
// In controllers/notice.controller.js
export const createNotice = async (req, res, next) => {
  try {
    const { title, message, societyId } = req.body;

    // Verify user has permissions for this society - UPDATED CODE
    if (req.user.role !== "superadmin") {
      // Handle both populated society object and raw society ID
      const userSocietyId = 
        req.user.society?._id ? 
        req.user.society._id.toString() : 
        req.user.society?.toString();
      
      if (userSocietyId !== societyId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to create notices for this society"
        });
      }
    }

    // Fetch residents of the society (role 'resident') and get their _id and email
    const residents = await User.find({ 
      role: "resident", 
      society: societyId 
    }).select("_id email");


console.log("User role:", req.user.role);
console.log("User society:", req.user.society);
console.log("Request societyId:", societyId);
console.log("Type of user society:", typeof req.user.society);
console.log("Type of request societyId:", typeof societyId);
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
