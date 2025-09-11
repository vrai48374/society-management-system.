// middleware/societyAuth.js

export const authorizeSocietyAdmin = (req, res, next) => {
  // The societyId to check against can come from the body or URL params
  const societyId = req.body.societyId || req.params.societyId;

  // Superadmin has access to everything, so  let them pass immediately
  if (req.user.role === "superadmin") {
    return next();
  }

  // Regular admin must belong to the society they are trying to manage
  if (req.user.role === "admin") {
    // First, safely check that the nested society object exists
    if (!req.user.flat?.block?.society) {
      return res.status(403).json({ 
        success: false, 
        message: "Authorization failed: User is not associated with a society." 
      });
    }
    
    
    // Compare the user's nested society ID with the one from the request
    if (req.user.flat.block.society._id.toString() !== societyId) {
      return res.status(403).json({
        success: false,
        message: "Authorization failed: You do not have permission for this society."
      });
    }

    // If the IDs match, the admin is authorized
    return next();
  }

  // If the user is neither a superadmin nor an admin, deny access
  return res.status(403).json({ success: false, message: "Access Denied." });
};