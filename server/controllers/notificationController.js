const Notification = require("../models/Notification");
const User = require("../models/User");

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead } = req.query;

    const skip = (page - 1) * limit;
    const query = { recipientId: req.user.id };

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Check authorization
    if (notification.recipientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to mark this notification"
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Archive notification
exports.archiveNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Check authorization
    if (notification.recipientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to archive this notification"
      });
    }

    notification.isArchived = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification archived"
    });
  } catch (error) {
    console.error("Archive notification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Check authorization
    if (notification.recipientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this notification"
      });
    }

    await Notification.deleteOne({ _id: notificationId });

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipientId: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get notifications by type
exports.getNotificationsByType = async (req, res) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
      recipientId: req.user.id,
      type
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments({
      recipientId: req.user.id,
      type
    });

    res.status(200).json({
      success: true,
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get notifications by type error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Create notification (used internally)
exports.createNotification = async (data) => {
  try {
    const notification = new Notification({
      recipientId: data.recipientId,
      recipientEmail: data.recipientEmail,
      recipientRole: data.recipientRole,
      entityType: data.entityType,
      entityId: data.entityId,
      societyId: data.societyId,
      type: data.type,
      subject: data.subject,
      message: data.message,
      htmlContent: data.htmlContent,
      actionUrl: data.actionUrl,
      actionButtonText: data.actionButtonText,
      relatedData: data.relatedData,
      priority: data.priority || "normal"
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};

// Get notification statistics
exports.getNotificationStats = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipientId: req.user.id
    });

    const stats = {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      archived: notifications.filter(n => n.isArchived).length,
      byType: {},
      byPriority: {}
    };

    // Count by type
    notifications.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Broadcast notification to multiple users
exports.broadcastNotification = async (req, res) => {
  try {
    const { societyId, recipientRole, subject, message } = req.body;

    // Check authorization - only admins and municipal officials
    const user = await User.findById(req.user.id);
    if (!["admin", "municipal_official", "community_leader"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to broadcast notifications"
      });
    }

    // Get recipients
    const query = { societyId };
    if (recipientRole) {
      query.role = recipientRole;
    }

    const recipients = await User.find(query);

    // Create notifications for each recipient
    const notifications = await Promise.all(
      recipients.map(recipient =>
        Notification.create({
          recipientId: recipient._id,
          recipientEmail: recipient.email,
          recipientRole: recipient.role,
          entityType: "system",
          societyId,
          type: "system_alert",
          subject,
          message,
          priority: "high"
        })
      )
    );

    res.status(201).json({
      success: true,
      message: `Notification sent to ${notifications.length} users`,
      sentCount: notifications.length
    });
  } catch (error) {
    console.error("Broadcast notification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
