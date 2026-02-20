const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Recipient
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    recipientEmail: String,
    recipientRole: {
      type: String,
      enum: ["volunteer", "community_leader", "municipal_official", "admin"]
    },

    // Reference to Entity
    entityType: {
      type: String,
      enum: ["issue", "task", "contribution", "escalation", "system"],
      required: true
    },
    entityId: mongoose.Schema.Types.ObjectId,

    // Society
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society"
    },

    // Notification Type
    type: {
      type: String,
      enum: [
        "issue_created",
        "issue_updated",
        "issue_resolved",
        "contribution_added",
        "task_assigned",
        "task_completed",
        "escalation_alert",
        "municipal_notification",
        "verification_request",
        "achievement_unlocked",
        "system_alert"
      ],
      required: true
    },

    // Content
    subject: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    htmlContent: String,

    // Action Info
    actionUrl: String,
    actionButtonText: String,

    // Related Info
    relatedData: {
      issueName: String,
      taskName: String,
      userNames: [String],
      criticality: String,
      daysOld: Number
    },

    // Delivery Status
    deliveryStatus: {
      email: {
        sent: {
          type: Boolean,
          default: false
        },
        sentAt: Date,
        openedAt: Date,
        error: String
      },
      push: {
        sent: {
          type: Boolean,
          default: false
        },
        sentAt: Date,
        deliveredAt: Date,
        error: String
      }
    },

    // User Interaction
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: Date,
    isArchived: {
      type: Boolean,
      default: false
    },

    // Priority
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal"
    },

    // Expiry
    expiresAt: Date,
    isExpired: {
      type: Boolean,
      default: false
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "notifications"
  }
);

// Index for faster queries
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientEmail: 1 });
notificationSchema.index({ entityType: 1, entityId: 1 });
notificationSchema.index({ societyId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ "deliveryStatus.email.sent": 1 });

module.exports = mongoose.model("Notification", notificationSchema);
