const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    // Reference to Issue
    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },

    // Image Analysis
    imageUrl: {
      type: String,
      required: true
    },

    // AI Generated Content
    generatedDescription: {
      type: String,
      required: false
    },
    generatedTags: [String],

    // Severity Detection
    severity: {
      level: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
        required: true
      },
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      },
      reasoning: String
    },

    // Category Detection
    category: {
      primary: {
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
        ],
        required: true
      },
      secondary: {
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
      confidence: {
        type: Number,
        min: 0,
        max: 100,
        required: true
      }
    },

    // Structural Elements Detection
    structuralAnalysis: {
      detectedElements: [
        {
          element: String, // e.g., "pothole", "broken_street_light", "damaged_road"
          location: String, // description of where in image
          severity: String,
          confidence: Number
        }
      ]
    },

    // Safety Information
    safetyHazards: {
      identified: Boolean,
      hazards: [
        {
          name: String,
          level: {
            type: String,
            enum: ["low", "medium", "high", "critical"]
          },
          description: String
        }
      ]
    },

    // Recommended Actions
    recommendedActions: [
      {
        action: String,
        priority: {
          type: String,
          enum: ["low", "medium", "high", "immediate"]
        },
        estimatedResolutionTime: String
      }
    ],

    // API & Model Information
    analysisEngine: {
      provider: {
        type: String,
        enum: ["google-gemini", "openai", "local-model"],
        default: "google-gemini"
      },
      model: String,
      version: String
    },

    // Quality Metrics
    qualityScore: {
      type: Number,
      min: 0,
      max: 100,
      description: "How reliable/accurate is this analysis"
    },

    // Verification
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verificationNotes: String,
    verifiedAt: Date,

    // Manual Corrections
    manualCorrections: {
      applied: Boolean,
      corrections: [
        {
          field: String,
          originalValue: mongoose.Schema.Types.Mixed,
          correctedValue: mongoose.Schema.Types.Mixed,
          correctedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          correctedAt: Date,
          reason: String
        }
      ]
    },

    // Timestamps
    analyzedAt: {
      type: Date,
      default: Date.now
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
    collection: "analyses"
  }
);

// Index for faster queries
analysisSchema.index({ issueId: 1 });
analysisSchema.index({ "severity.level": 1 });
analysisSchema.index({ "category.primary": 1 });
analysisSchema.index({ verified: 1 });
analysisSchema.index({ analyzedAt: -1 });

module.exports = mongoose.model("Analysis", analysisSchema);
