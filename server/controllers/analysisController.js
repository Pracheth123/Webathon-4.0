const Analysis = require("../models/Analysis");
const Issue = require("../models/Issue");

// Analyze issue image (called after image analysis from Gemini)
exports.analyzeIssue = async (req, res) => {
  try {
    const { issueId, imageUrl, description, tags, severity, category, confidence } = req.body;

    // Validation
    if (!issueId || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide issueId and imageUrl"
      });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    // Create analysis record
    const analysis = new Analysis({
      issueId,
      imageUrl,
      generatedDescription: description,
      generatedTags: tags || [],
      severity: {
        level: severity || "medium",
        confidence: confidence || 75,
        reasoning: `Auto-analyzed using AI`
      },
      category: {
        primary: category || "other",
        confidence: confidence || 75
      },
      analysisEngine: {
        provider: "google-gemini",
        model: "gemini-pro-vision",
        version: "1.0"
      },
      analyzedAt: new Date()
    });

    await analysis.save();

    // Update issue with AI analysis
    issue.generatedDescription = description;
    issue.tags = tags || [];
    issue.aiAnalysis = {
      isAnalyzed: true,
      severity: severity,
      category: category,
      confidence: confidence,
      analyzedAt: new Date()
    };

    // Update criticality based on severity
    updateCriticalityBySeverity(issue, severity);

    await issue.save();

    res.status(201).json({
      success: true,
      message: "Issue analyzed successfully",
      analysis: {
        id: analysis._id,
        description: analysis.generatedDescription,
        tags: analysis.generatedTags,
        severity: analysis.severity.level,
        category: analysis.category.primary
      }
    });
  } catch (error) {
    console.error("Analyze issue error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get analysis by issue ID
exports.getAnalysisByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;

    const analysis = await Analysis.findOne({ issueId }).populate("verifiedBy", "name");

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "No analysis found for this issue"
      });
    }

    res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Verify analysis
exports.verifyAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;
    const { verified, notes, corrections } = req.body;

    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found"
      });
    }

    analysis.verified = verified;
    analysis.verifiedBy = req.user.id;
    analysis.verificationNotes = notes;
    analysis.verifiedAt = new Date();

    // Apply corrections if any
    if (corrections && corrections.length > 0) {
      analysis.manualCorrections = {
        applied: true,
        corrections: corrections.map(c => ({
          field: c.field,
          originalValue: c.originalValue,
          correctedValue: c.correctedValue,
          correctedBy: req.user.id,
          correctedAt: new Date(),
          reason: c.reason
        }))
      };
    }

    await analysis.save();

    res.status(200).json({
      success: true,
      message: "Analysis verified successfully",
      analysis
    });
  } catch (error) {
    console.error("Verify analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get analysis quality metrics
exports.getAnalysisMetrics = async (req, res) => {
  try {
    const { societyId } = req.params;

    const analyses = await Analysis.find({ societyId });

    if (analyses.length === 0) {
      return res.status(200).json({
        success: true,
        metrics: {
          totalAnalyzed: 0,
          verifiedAnalyses: 0,
          verificationRate: 0,
          avgConfidence: 0,
          categoriesDetected: {}
        }
      });
    }

    const totalAnalyzed = analyses.length;
    const verifiedAnalyses = analyses.filter(a => a.verified).length;
    const avgConfidence = (
      analyses.reduce((sum, a) => sum + (a.severity?.confidence || 0), 0) / totalAnalyzed
    ).toFixed(2);

    // Count categories
    const categoriesDetected = {};
    analyses.forEach(a => {
      const category = a.category?.primary || "other";
      categoriesDetected[category] = (categoriesDetected[category] || 0) + 1;
    });

    const metrics = {
      totalAnalyzed,
      verifiedAnalyses,
      verificationRate: ((verifiedAnalyses / totalAnalyzed) * 100).toFixed(2),
      avgConfidence,
      categoriesDetected
    };

    res.status(200).json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error("Get analysis metrics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get unverified analyses
exports.getUnverifiedAnalyses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ verified: false })
      .populate("issueId", "title location")
      .sort({ analyzedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Analysis.countDocuments({ verified: false });

    res.status(200).json({
      success: true,
      analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get unverified analyses error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Helper function to update criticality based on severity
function updateCriticalityBySeverity(issue, severity) {
  let severityScore = 0;

  switch (severity) {
    case "critical":
      severityScore = 40;
      break;
    case "high":
      severityScore = 30;
      break;
    case "medium":
      severityScore = 20;
      break;
    case "low":
      severityScore = 10;
      break;
    default:
      severityScore = 15;
  }

  // Combine with existing scoress
  const totalScore = severityScore + (issue.criticality?.baseScore || 0);

  let level = 1;
  if (totalScore < 20) level = 1;
  else if (totalScore < 40) level = 2;
  else if (totalScore < 60) level = 3;
  else if (totalScore < 80) level = 4;
  else level = 5;

  issue.criticality.level = level;
  issue.criticality.baseScore = severityScore;
}
