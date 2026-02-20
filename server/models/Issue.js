const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    generatedDescription: {
      type: String,
      default: null
    },
    tags: [String], // Auto-generated tags from AI analysis

    // Image & Evidence
    image: {
      type: String,
      required: true
    },
    beforeImage: String, // For pre-resolution comparison
    afterImage: String, // For post-resolution comparison
    multipleImages: [String], // Additional evidence images

    // Location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: [Number], // [longitude, latitude]
      address: String,
      landmark: String
    },

    // Society & Reporter
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Issue Status
    status: {
      type: String,
      enum: ["open", "in-progress", "under-review", "resolved", "closed"],
      default: "open"
    },

    // Criticality Level
    criticality: {
      level: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        default: 1
      },
      baseScore: {
        type: Number,
        default: 0,
        description: "AI analysis based score"
      },
      ageScore: {
        type: Number,
        default: 0,
        description: "Score based on how old the issue is"
      },
      contributionScore: {
        type: Number,
        default: 0,
        description: "Score based on number of verifications"
      },
      lastUpdatedAt: Date
    },

    // AI Analysis Results
    aiAnalysis: {
      isAnalyzed: {
        type: Boolean,
        default: false
      },
      severity: {
        type: String,
        enum: ["low", "medium", "high", "critical", null],
        default: null
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
          "other",
          null
        ],
        default: null
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100
      },
      analyzedAt: Date
    },

    // Contributions & Verifications
    contributions: {
      count: {
        type: Number,
        default: 0
      },
      contributors: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        image: String,
        description: String,
        timestamp: Date
      }],
      verifications: [{
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        verified: Boolean,
        comment: String,
        timestamp: Date
      }]
    },

    // Resolution Info
    resolution: {
      resolvedBy: {
        type: String,
        enum: ["volunteer", "municipal_official", "community_leader", null],
        default: null
      },
      resolvedById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      resolvedAt: Date,
      resolutionNotes: String,
      proofImage: String
    },

    // Escalation
    escalation: {
      isEscalated: {
        type: Boolean,
        default: false
      },
      escalatedAt: Date,
      escalatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      escalationReason: String,
      sentToMunicipal: {
        type: Boolean,
        default: false
      },
      sentAt: Date
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    oldestContributionDate: {
      type: Date,
      description: "Date of the first contribution that confirms this issue"
    }
  },
  {
    collection: "issues"
  }
);

// Index for faster queries
issueSchema.index({ societyId: 1, status: 1 });
issueSchema.index({ "criticality.level": -1 });
issueSchema.index({ "location.coordinates": "2dsphere" }); // Geospatial index
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ createdAt: -1 });
issueSchema.index({ "aiAnalysis.category": 1 });

module.exports = mongoose.model("Issue", issueSchema);
