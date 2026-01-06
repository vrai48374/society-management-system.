export const authorizeSocietyAdmin = (req, res, next) => {

  // Superadmin → full access
  if (req.user.role === "superadmin") {
    return next();
  }

  // Admin → must have society
  if (req.user.role === "admin") {
    if (!req.user.society) {
      return res.status(403).json({
        success: false,
        message: "Admin is not assigned to any society"
      });
    }

    // Lock admin to society
    req.society = req.user.society;
    return next();
  }

  // Others (resident)
  return res.status(403).json({
    success: false,
    message: "Access denied"
  });
};
