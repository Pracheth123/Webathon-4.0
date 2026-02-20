const mongoose = require("mongoose");

const societySchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    image: String,

    // Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number] // [longitude, latitude]
    },
    address: {
      street: String,
      city: {
        type: String,
        required: true
      },
      state: String,
      pinCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        default: "India"
      }
    },

    // Administration
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    communityLeaders: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    municipalContacts: [{
      name: String,
      email: String,
      phone: String,
      department: String
    }],

    // Society Stats
    totalMembers: {
      type: Number,
      default: 0
    },
    totalVolunteers: {
      type: Number,
      default: 0
    },
    totalIssuesReported: {
      type: Number,
      default: 0
    },
    totalIssuesResolved: {
      type: Number,
      default: 0
    },
    resolutionRate: {
      type: Number,
      default: 0
    },

    // Settings
    settings: {
      allowPublicContributions: {
        type: Boolean,
        default: true
      },
      criticityAutoCalculation: {
        type: Boolean,
        default: true
      },
      requireVerification: {
        type: Boolean,
        default: true
      },
      autoEmailOnEscalation: {
        type: Boolean,
        default: true
      }
    },

    // Activity Tracking
    lastActivityAt: Date,
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
    collection: "societies"
  }
);

// Index for faster queries
societySchema.index({ "address.city": 1, "address.pinCode": 1 });
societySchema.index({ adminId: 1 });

module.exports = mongoose.model("Society", societySchema);
