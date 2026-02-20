const Issue = require("../models/Issue");
const User = require("../models/User");
const Contribution = require("../models/Contribution");
const Notification = require("../models/Notification");
const Society = require("../models/Society");

// Create new issue
exports.createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      address,
      landmark,
      image,
      tags
    } = req.body;

    // Validation
    if (!title || !image || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, image, latitude, and longitude"
      });
    }

    const user = await User.findById(req.user.id);

    // Create issue
    const issue = new Issue({
      title,
      description: description || "",
      image,
      reportedBy: req.user.id,
      societyId: user.societyId,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
        landmark
      },
      tags: tags || [],
      criticality: {
        level: 1,
        baseScore: 0,
        ageScore: 0,
        contributionScore: 0
      },
      contributions: {
        count: 1,
        contributors: [
          {
            userId: req.user.id,
            image,
            description,
            timestamp: new Date()
          }
        ]
      }
    });

    await issue.save();

    // Update user statistics
    user.contributionsCount += 1;
    user.civicScore += 10; // Points for reporting
    await user.save();

    // Update society statistics
    const society = await Society.findById(user.societyId);
    if (society) {
      society.totalIssuesReported += 1;
      society.lastActivityAt = new Date();
      await society.save();
    }

    // Notify community leaders and municipal officials
    await notifyAuthorities(user.societyId, {
      type: "issue_created",
      issueName: title,
      reporterName: user.name,
      issueId: issue._id
    });

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      issue: {
        id: issue._id,
        title: issue.title,
        location: issue.location,
        status: issue.status,
        criticality: issue.criticality.level,
        createdAt: issue.createdAt
      }
    });
  } catch (error) {
    console.error("Create issue error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all issues for a society
exports.getIssues = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { status, criticality, page = 1, limit = 10, sortBy = "-criticality.level" } = req.query;

    const skip = (page - 1) * limit;
    const query = { societyId };

    if (status) {
      query.status = status;
    }

    if (criticality) {
      query["criticality.level"] = parseInt(criticality);
    }

    const issues = await Issue.find(query)
      .populate("reportedBy", "name avatar")
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Issue.countDocuments(query);

    res.status(200).json({
      success: true,
      issues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get issue by ID
exports.getIssueById = async (req, res) => {
  try {
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId)
      .populate("reportedBy", "name avatar civicScore")
      .populate("contributions.contributors.userId", "name avatar")
      .populate("contributions.verifications.userId", "name avatar")
      .populate("resolution.resolvedById", "name avatar");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    res.status(200).json({
      success: true,
      issue
    });
  } catch (error) {
    console.error("Get issue by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Add contribution to issue
exports.addContribution = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { description, image } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    // Check if contribution already exists from this user
    const existingContribution = issue.contributions.contributors.find(
      c => c.userId?.toString() === req.user.id
    );

    if (!existingContribution) {
      // Add as new contributor
      issue.contributions.contributors.push({
        userId: req.user.id,
        image: image || issue.image,
        description,
        timestamp: new Date()
      });

      issue.contributions.count += 1;

      // Recalculate criticality based on contributions
      calculateCriticality(issue);
    }

    issue.updatedAt = new Date();
    await issue.save();

    // Update user statistics
    const user = await User.findById(req.user.id);
    user.contributionsCount += 1;
    user.civicScore += 5; // Points for contribution
    await user.save();

    // Create contribution record
    const contribution = new Contribution({
      issueId,
      contributorId: req.user.id,
      societyId: issue.societyId,
      type: "verification",
      image: image || issue.image,
      description,
      verificationStatus: "approved"
    });

    await contribution.save();

    res.status(200).json({
      success: true,
      message: "Contribution added successfully",
      criticalityLevel: issue.criticality.level
    });
  } catch (error) {
    console.error("Add contribution error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update issue status
exports.updateIssueStatus = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { status, resolutionNotes, proofImage } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const user = await User.findById(req.user.id);

    // Check authorization
    if (user.role !== "municipal_official" && user.role !== "community_leader" && issue.reportedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this issue"
      });
    }

    issue.status = status;

    if (status === "resolved") {
      issue.resolution = {
        resolvedBy: user.role,
        resolvedById: req.user.id,
        resolvedAt: new Date(),
        resolutionNotes,
        proofImage
      };

      // Update society resolution stats
      const society = await Society.findById(issue.societyId);
      if (society) {
        society.totalIssuesResolved += 1;
        society.resolutionRate = ((society.totalIssuesResolved / society.totalIssuesReported) * 100).toFixed(2);
        await society.save();
      }

      // Award points to resolver
      if (user.role === "municipal_official") {
        user.civicScore += 50;
      } else if (user.role === "community_leader") {
        user.civicScore += 30;
      }
      await user.save();
    }

    issue.updatedAt = new Date();
    await issue.save();

    res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue
    });
  } catch (error) {
    console.error("Update issue status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Escalate issue to municipal authorities
exports.escalateIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const { reason } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    issue.escalation = {
      isEscalated: true,
      escalatedAt: new Date(),
      escalatedBy: req.user.id,
      escalationReason: reason,
      sentToMunicipal: true,
      sentAt: new Date()
    };

    issue.status = "under-review";
    await issue.save();

    // Notify municipal officials
    const society = await Society.findById(issue.societyId);
    const municipalOfficials = await User.find({
      societyId: issue.societyId,
      role: "municipal_official"
    });

    for (const official of municipalOfficials) {
      await Notification.create({
        recipientId: official._id,
        recipientEmail: official.email,
        recipientRole: official.role,
        entityType: "escalation",
        entityId: issueId,
        societyId: issue.societyId,
        type: "escalation_alert",
        subject: `Escalated Issue: ${issue.title}`,
        message: `An issue has been escalated: ${issue.title}. Reason: ${reason}`,
        priority: "high"
      });
    }

    res.status(200).json({
      success: true,
      message: "Issue escalated successfully",
      issue
    });
  } catch (error) {
    console.error("Escalate issue error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Search issues by location (nearby issues)
exports.getNearbyIssues = async (req, res) => {
  try {
    const { latitude, longitude, distance = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude"
      });
    }

    const issues = await Issue.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(distance)
        }
      },
      status: { $ne: "resolved" }
    }).limit(20);

    res.status(200).json({
      success: true,
      issues
    });
  } catch (error) {
    console.error("Get nearby issues error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Helper function to calculate criticality
function calculateCriticality(issue) {
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

// Helper function to notify authorities
async function notifyAuthorities(societyId, data) {
  try {
    const authorities = await User.find({
      societyId,
      role: { $in: ["community_leader", "municipal_official"] }
    });

    for (const authority of authorities) {
      await Notification.create({
        recipientId: authority._id,
        recipientEmail: authority.email,
        recipientRole: authority.role,
        entityType: "issue",
        entityId: data.issueId,
        societyId,
        type: data.type,
        subject: `New Issue: ${data.issueName}`,
        message: `${data.reporterName} has reported: ${data.issueName}`,
        priority: "normal"
      });
    }
  } catch (error) {
    console.error("Notify authorities error:", error);
  }
}
