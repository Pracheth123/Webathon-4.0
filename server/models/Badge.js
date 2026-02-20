const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    icon: String, // URL to badge icon
    color: String, // Color code for badge

    // Badge Criteria
    criteria: {
      type: {
        type: String,
        enum: [
          "contribution_count",
          "verification_count",
          "task_completion",
          "reliability_score",
          "first_contribution",
          "streak",
          "special_achievement",
          "role_based"
        ],
        required: true
      },
      threshold: Number,
      description: String
    },

    // Badge Category
    category: {
      type: String,
      enum: [
        "engagement",
        "reliability",
        "expertise",
        "leadership",
        "special"
      ],
      default: "engagement"
    },

    // Rarity
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "epic", "legendary"],
      default: "common"
    },

    // Usage
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "badges"
  }
);

module.exports = mongoose.model("Badge", badgeSchema);
