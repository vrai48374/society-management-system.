// middleware/societyAuth.js
export const authorizeSocietyAdmin = async (req, res, next) => {
  try {
    const { societyId } = req.body;
    
    // Superadmins can access any society
    if (req.user.role === "superadmin") {
      return next();
    }

    // Check if user is admin of the target society
    if (req.user.role === "admin" && req.user.society.toString() === societyId) {
      return next();
    }

    res.status(403).json({
      success: false,
      message: "Not authorized to perform this action"
    });
  } catch (error) {
    next(error);
  }
};