module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

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