module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // ❌ No user attached (auth middleware missing)
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // ❌ Role not allowed
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Authorization error",
      });
    }
  };
};