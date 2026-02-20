const express = require("express");
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", notificationController.getUserNotifications);
router.post("/:notificationId/read", notificationController.markAsRead);
router.post("/read-all", notificationController.markAllAsRead);
router.post("/:notificationId/archive", notificationController.archiveNotification);
router.delete("/:notificationId", notificationController.deleteNotification);
router.get("/unread/count", notificationController.getUnreadCount);
router.get("/by-type/:type", notificationController.getNotificationsByType);
router.get("/notification/stats", notificationController.getNotificationStats);

// Admin/Leaders only
router.post("/broadcast",
  authorize("admin", "municipal_official", "community_leader"),
  notificationController.broadcastNotification
);

module.exports = router;
