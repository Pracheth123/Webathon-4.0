const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    // Reference to Issue
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },

    // Contributor Info
    contributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },

    // Contribution Type
    type: {
      type: String,
      enum: ["verification", "additional-evidence", "description", "comment"],
      default: "verification"
    },

    // Content
    image: String,
    description: String,
    comment: String,
    evidence: {
      images: [String],
      video: String
    },

    // Engagement
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    },
    helpfulCount: {
      type: Number,
      default: 0
    },

    // Verification Status
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verificationComment: String,
    verifiedAt: Date,

    // Quality Score
    qualityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // Points & Rewards
    pointsEarned: {
      type: Number,
      default: 0
    },
    badgeEarned: {
      name: String,
      description: String,
      earnedAt: Date
    },

    // Status
    isDeleted: {
      type: Boolean,
      default: false
    },

    // Timestamps
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
    collection: "contributions"
  }
);

// Index for faster queries
contributionSchema.index({ issueId: 1 });
contributionSchema.index({ contributorId: 1 });
contributionSchema.index({ societyId: 1 });
contributionSchema.index({ verificationStatus: 1 });
contributionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Contribution", contributionSchema);
