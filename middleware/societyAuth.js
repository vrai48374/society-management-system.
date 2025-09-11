// middleware/societyAuth.js

export const authorizeSocietyAdmin = (req, res, next) => {
  const societyId = req.body.societyId || req.params.societyId;
  
  // Superadmins can do anything
  if (req.user.role === "superadmin") {
    return next();
  }

  // Admins must belong to the society they are managing
  if (req.user.role === "admin") {
    // Because of our new 'protect' middleware, we can just check req.user.society
    if (!req.user.society) {
      return res.status(403).json({ 
        success: false, 
        message: "Authorization failed: Admin is not associated with a society." 
      });
    }

    if (req.user.society._id.toString() !== societyId) {
      return res.status(403).json({
        success: false,
        message: "Authorization failed: You do not have permission for this society."
      });
    }

    return next();
  }

  // Any other role (like 'resident') is denied
  return res.status(403).json({ success: false, message: "Access Denied." });
};