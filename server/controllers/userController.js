const User = require("../models/User");
const Issue = require("../models/Issue");
const Contribution = require("../models/Contribution");

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, location, address, city, pinCode } = req.body;

    const user = await User.findById(req.user.id);

    // Update basic info
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Update profile
    if (bio) user.profile.bio = bio;
    if (address) user.profile.address = address;
    if (city) user.profile.city = city;
    if (pinCode) user.profile.pinCode = pinCode;

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided"
      });
    }

    const user = await User.findById(req.user.id);
    user.avatar = `/uploads/${req.file.filename}`;
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: user.avatar
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get user statistics
exports.getStatistics = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const issuesReported = await Issue.countDocuments({ reportedBy: req.user.id });

    const contributions = await Contribution.find({ contributorId: req.user.id });
    const contributionsCount = contributions.length;
    const verifiedContributions = contributions.filter(c => c.verificationStatus === "approved").length;

    const stats = {
      civicScore: user.civicScore,
      reliabilityScore: user.reliabilityScore,
      issuesReported,
      contributionsCount,
      verifiedContributions,
      tasksCompleted: user.tasksCompleted,
      tasksVerified: user.tasksVerified,
      badges: user.badges.length,
      memberSince: user.createdAt
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Get statistics error:", error);
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
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const contributions = await Contribution.find({ contributorId: req.user.id })
      .populate("issueId", "title location status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Contribution.countDocuments({ contributorId: req.user.id });

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

// Get user leaderboard position
exports.getLeaderboardPosition = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const societyId = user.societyId;

    // Get rank based on civic score
    const rank = await User.countDocuments({
      societyId: societyId,
      civicScore: { $gt: user.civicScore }
    });

    // Get top 10 contributors in society
    const topContributors = await User.find({ societyId })
      .sort({ civicScore: -1 })
      .limit(10)
      .select("name civicScore avatar reliabilityScore");

    const userPosition = topContributors.findIndex(u => u._id.toString() === user._id.toString()) + 1;

    res.status(200).json({
      success: true,
      userRank: rank + 1,
      userPosition: userPosition || null,
      topContributors
    });
  } catch (error) {
    console.error("Get leaderboard position error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get user badges
exports.getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("badges");

    res.status(200).json({
      success: true,
      badges: user.badges
    });
  } catch (error) {
    console.error("Get badges error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get notification preferences
exports.getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      preferences: {
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications
      }
    });
  } catch (error) {
    console.error("Get notification preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications } = req.body;

    const user = await User.findById(req.user.id);

    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) user.pushNotifications = pushNotifications;

    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      preferences: {
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications
      }
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Deactivate account
exports.deactivateAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    // Verify password before deactivation
    const bcrypt = require("bcryptjs");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }

    user.isActive = false;
    user.updatedAt = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deactivated successfully"
    });
  } catch (error) {
    console.error("Deactivate account error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
