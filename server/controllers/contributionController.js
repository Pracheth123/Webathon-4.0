const Contribution = require("../models/Contribution");
const Issue = require("../models/Issue");
const User = require("../models/User");

// Create contribution
exports.createContribution = async (req, res) => {
  try {
    const { issueId, type, description, image, comment } = req.body;

    // Validation
    if (!issueId) {
      return res.status(400).json({
        success: false,
        message: "Please provide issueId"
      });
    }

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const user = await User.findById(req.user.id);

    // Create contribution
    const contribution = new Contribution({
      issueId,
      contributorId: req.user.id,
      societyId: issue.societyId,
      type: type || "verification",
      description,
      image: image || issue.image,
      comment,
      verificationStatus: "pending"
    });

    await contribution.save();

    // Add to issue contributions
    issue.contributions.contributors.push({
      userId: req.user.id,
      image: image || issue.image,
      description,
      timestamp: new Date()
    });

    issue.contributions.count += 1;

    // Recalculate criticality
    calculateIssueCriticality(issue);

    await issue.save();

    // Update user stats
    user.contributionsCount += 1;
    user.civicScore += 5;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Contribution created successfully",
      contribution: {
        id: contribution._id,
        type: contribution.type,
        status: contribution.verificationStatus,
        createdAt: contribution.createdAt
      }
    });
  } catch (error) {
    console.error("Create contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get contributions for issue
exports.getContributionsByIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const contributions = await Contribution.find({ issueId })
      .populate("contributorId", "name avatar civicScore")
      .populate("verifiedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contribution.countDocuments({ issueId });

    res.status(200).json({
      success: true,
      contributions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get contributions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get user contributions
exports.getUserContributions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const contributions = await Contribution.find({ contributorId: userId })
      .populate("issueId", "title location status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contribution.countDocuments({ contributorId: userId });

    res.status(200).json({
      success: true,
      contributions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get user contributions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Verify contribution
exports.verifyContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    const { verified, comment } = req.body;

    const contribution = await Contribution.findById(contributionId);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: "Contribution not found"
      });
    }

    // Only leaders and officials can verify
    const user = await User.findById(req.user.id);
    if (!["community_leader", "municipal_official"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to verify contributions"
      });
    }

    contribution.verificationStatus = verified ? "approved" : "rejected";
    contribution.verifiedBy = req.user.id;
    contribution.verificationComment = comment;
    contribution.verifiedAt = new Date();

    // If approved, award points
    if (verified) {
      contribution.pointsEarned = 10;

      const contributor = await User.findById(contribution.contributorId);
      if (contributor) {
        contributor.civicScore += 10;
        contributor.reliabilityScore = Math.min(contributor.reliabilityScore + 2, 100);
        await contributor.save();
      }
    }

    await contribution.save();

    res.status(200).json({
      success: true,
      message: "Contribution verified successfully",
      contribution
    });
  } catch (error) {
    console.error("Verify contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Rate contribution
exports.rateContribution = async (req, res) => {
  try {
    const { contributionId } = req.params;
    const { helpful } = req.body;

    const contribution = await Contribution.findById(contributionId);

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: "Contribution not found"
      });
    }

    if (helpful) {
      contribution.helpfulCount += 1;
    }

    await contribution.save();

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      helpfulCount: contribution.helpfulCount
    });
  } catch (error) {
    console.error("Rate contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get pending contributions
exports.getPendingContributions = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const contributions = await Contribution.find({
      societyId,
      verificationStatus: "pending"
    })
      .populate("contributorId", "name avatar civicScore")
      .populate("issueId", "title location")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contribution.countDocuments({
      societyId,
      verificationStatus: "pending"
    });

    res.status(200).json({
      success: true,
      contributions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get pending contributions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get contribution statistics
exports.getContributionStats = async (req, res) => {
  try {
    const { societyId } = req.params;

    const contributions = await Contribution.find({ societyId });

    if (contributions.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalContributions: 0,
          approvedContributions: 0,
          approvalRate: 0,
          avgQualityScore: 0
        }
      });
    }

    const totalContributions = contributions.length;
    const approvedContributions = contributions.filter(c => c.verificationStatus === "approved").length;
    const avgQualityScore = (
      contributions.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / totalContributions
    ).toFixed(2);

    const stats = {
      totalContributions,
      approvedContributions,
      approvalRate: ((approvedContributions / totalContributions) * 100).toFixed(2),
      avgQualityScore,
      contributionsByType: contributions.reduce((acc, c) => {
        acc[c.type] = (acc[c.type] || 0) + 1;
        return acc;
      }, {})
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Get contribution stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Helper function to calculate issue criticality
function calculateIssueCriticality(issue) {
  let score = 0;

  // Base score from contributions
  const contributionScore = Math.min(issue.contributions.count * 10, 50);

  // Age score (older issues get higher priority)
  const ageInDays = (new Date() - issue.createdAt) / (1000 * 60 * 60 * 24);
  const ageScore = Math.min(ageInDays * 2, 30);

  score = contributionScore + ageScore;

  // Determine level
  let level = 1;
  if (score < 20) level = 1;
  else if (score < 40) level = 2;
  else if (score < 60) level = 3;
  else if (score < 80) level = 4;
  else level = 5;

  issue.criticality = {
    level,
    baseScore: contributionScore,
    ageScore,
    contributionScore,
    lastUpdatedAt: new Date()
  };
}
