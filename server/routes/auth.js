const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.post("/verify", authMiddleware, authController.verifyToken);
router.post("/change-password", authMiddleware, authController.changePassword);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
