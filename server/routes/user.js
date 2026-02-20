const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Profile routes
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.post("/avatar", userController.uploadAvatar);

// Statistics routes
router.get("/stats", userController.getStatistics);
router.get("/contributions", userController.getUserContributions);
router.get("/leaderboard", userController.getLeaderboardPosition);
router.get("/badges", userController.getBadges);

// Notification preferences
router.get("/notifications-prefs", userController.getNotificationPreferences);
router.put("/notifications-prefs", userController.updateNotificationPreferences);

// Account management
router.post("/deactivate", userController.deactivateAccount);

module.exports = router;
