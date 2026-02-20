const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    phone: {
      type: String,
      match: /^[0-9]{10}$/
    },
    avatar: {
      type: String,
      default: null
    },

    // Role & Society
    role: {
      type: String,
      enum: ["volunteer", "community_leader", "municipal_official", "admin"],
      default: "volunteer"
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },

    // Profile Info
    profile: {
      bio: String,
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point"
        },
        coordinates: [Number] // [longitude, latitude]
      },
      address: String,
      city: String,
      pinCode: String
    },

    // Civic Score & Reputation
    civicScore: {
      type: Number,
      default: 0
    },
    reliabilityScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    contributionsCount: {
      type: Number,
      default: 0
    },
    tasksCompleted: {
      type: Number,
      default: 0
    },
    tasksVerified: {
      type: Number,
      default: 0
    },

    // Badges & Achievements
    badges: [{
      name: String,
      earnedAt: Date,
      description: String
    }],

    // Contact Preferences
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,

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
    collection: "users"
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ societyId: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
