const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },

    // Task Type & Category
    type: {
      type: String,
      enum: [
        "image-capture",
        "translation",
        "verification",
        "facility-check",
        "data-collection",
        "survey",
        "cleanup",
        "other"
      ],
      required: true
    },
    category: {
      type: String,
      enum: [
        "infrastructure",
        "sanitation",
        "street-damage",
        "water-supply",
        "electricity",
        "public-notice",
        "vegetation",
        "waste-management",
        "other"
      ]
    },

    // Task Details
    requirements: [String], // What user needs to do
    estimatedTime: {
      type: Number,
      description: "In minutes"
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },

    // Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
      radius: {
        type: Number,
        default: 500,
        description: "In meters - where user can complete the task from"
      }
    },

    // Society & Assignment
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    relatedIssueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue"
    },

    // Task Status
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "expired", "cancelled"],
      default: "open"
    },

    // Assignments & Submissions
    assignments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      assignedAt: Date,
      status: {
        type: String,
        enum: ["pending", "in-progress", "submitted", "rejected", "approved"],
        default: "pending"
      },
      submittedAt: Date,
      approvedAt: Date,
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      submissionData: {
        images: [String],
        description: String,
        notes: String,
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point"
          },
          coordinates: [Number]
        }
      }
    }],

    // Rewards & Incentives
    rewards: {
      points: {
        type: Number,
        default: 10
      },
      badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge"
      },
      incentive: {
        type: Number,
        default: 0,
        description: "Monetary or virtual currency"
      }
    },

    // Timeline
    deadline: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },

    // Stats
    totalAssignments: {
      type: Number,
      default: 0
    },
    completedAssignments: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },

    // Metadata
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "tasks"
  }
);

// Index for faster queries
taskSchema.index({ societyId: 1, status: 1 });
taskSchema.index({ "location.coordinates": "2dsphere" });
taskSchema.index({ deadline: 1 });
taskSchema.index({ type: 1, category: 1 });

module.exports = mongoose.model("Task", taskSchema);
