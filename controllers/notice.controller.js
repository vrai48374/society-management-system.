import Notice from "../models/Notice.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

// controllers/notice.controller.js
// In controllers/notice.controller.js
export const createNotice = async (req, res, next) => {
  try {
    const { title, message, societyId } = req.body;

    // Verify user has permissions for this society
    if (req.user.role !== "superadmin") {
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

    // Fetch residents of the society
    const residents = await User.find({ 
      role: "resident", 
      society: societyId 
    }).select("_id email");

    // Extract resident IDs for the notice
    const residentIds = residents.map(resident => resident._id);

    // Create the notice
    const notice = new Notice({
      title,
      message,
      society: societyId,
      createdBy: req.user._id,
      sendTo: residentIds,
      createdAt: new Date()
    });

    await notice.save();
    await notice.populate('createdBy', 'name email');

    // Send emails with better error handling
    const emailPromises = residents.map(async (resident) => {
      try {
        await sendEmail({
          to: resident.email,
          subject: `Notice: ${title}`,
          text: message,
          html: `<p>${message}</p>`
        });
        console.log(`Email sent to ${resident.email}`);
      } catch (error) {
        console.error(`Failed to send email to ${resident.email}:`, error);
        // Don't throw error here to prevent failing the whole operation
      }
    });

    // Wait for all emails to be sent (or fail)
    await Promise.allSettled(emailPromises);
console.log("Attempting to send emails to:", residents.map(r => r.email));

    res.status(201).json({
      success: true,
      message: "Notice created and sent successfully",
      data: notice
    });

  } catch (err) {
    console.error("Error in createNotice:", err);
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
