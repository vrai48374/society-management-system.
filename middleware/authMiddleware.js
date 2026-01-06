// middleware/societyAuth.js

export const authorizeSocietyAdmin = (req, res, next) => {

  // Superadmin can access everything
  if (req.user.role === "superadmin") {
    return next();
  }

  // Admin access
  if (req.user.role === "admin") {

    if (!req.user.society) {
      return res.status(403).json({
        success: false,
        message: "Admin is not assigned to any society"
      });
    }

    // Lock admin to his society
    req.society = req.user.society;
    return next();
  }

  // Others (resident etc.)
  return res.status(403).json({
    success: false,
    message: "Access denied"
  });
};
