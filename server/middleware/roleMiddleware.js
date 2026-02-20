const User = require("../models/User");

// Role-based authorization middleware
const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "You don't have permission to perform this action"
        });
      }

      req.user.role = user.role;
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  };
};

module.exports = authorize;
