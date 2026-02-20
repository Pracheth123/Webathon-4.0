const Society = require("../models/Society");
const User = require("../models/User");
const Issue = require("../models/Issue");

// Create new society
exports.createSociety = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      pinCode,
      country,
      latitude,
      longitude,
      municipalContacts
    } = req.body;

    // Validation
    if (!name || !city || !pinCode) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, city, and pinCode"
      });
    }

    // Check if society already exists
    const existingSociety = await Society.findOne({
      "address.city": city,
      "address.pinCode": pinCode,
      name
    });

    if (existingSociety) {
      return res.status(409).json({
        success: false,
        message: "Society with this name already exists in this location"
      });
    }

    // Create society
    const society = new Society({
      name,
      description,
      address: {
        street: address,
        city,
        state,
        pinCode,
        country: country || "India"
      },
      location: {
        type: "Point",
        coordinates: [longitude || 0, latitude || 0]
      },
      adminId: req.user.id,
      municipalContacts: municipalContacts || []
    });

    await society.save();

    // Update user as admin of this society
    const user = await User.findById(req.user.id);
    user.societyId = society._id;
    user.role = "community_leader";
    await user.save();

    res.status(201).json({
      success: true,
      message: "Society created successfully",
      society
    });
  } catch (error) {
    console.error("Create society error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get society by ID
exports.getSociety = async (req, res) => {
  try {
    const { societyId } = req.params;

    const society = await Society.findById(societyId)
      .populate("adminId", "name email")
      .populate("communityLeaders", "name email avatar");

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    res.status(200).json({
      success: true,
      society
    });
  } catch (error) {
    console.error("Get society error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update society
exports.updateSociety = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { name, description, municipalContacts, settings } = req.body;

    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Check authorization (only admin can update)
    if (society.adminId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this society"
      });
    }

    if (name) society.name = name;
    if (description) society.description = description;
    if (municipalContacts) society.municipalContacts = municipalContacts;
    if (settings) {
      society.settings = {
        ...society.settings,
        ...settings
      };
    }

    society.updatedAt = new Date();
    await society.save();

    res.status(200).json({
      success: true,
      message: "Society updated successfully",
      society
    });
  } catch (error) {
    console.error("Update society error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all members of a society
exports.getSocietyMembers = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { page = 1, limit = 20, role } = req.query;

    const skip = (page - 1) * limit;
    const query = { societyId };

    if (role) {
      query.role = role;
    }

    const members = await User.find(query)
      .select("-password")
      .sort({ civicScore: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get society members error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get society statistics
exports.getSocietyStatistics = async (req, res) => {
  try {
    const { societyId } = req.params;

    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Calculate statistics
    const openIssues = await Issue.countDocuments({
      societyId,
      status: "open"
    });

    const resolvedIssues = await Issue.countDocuments({
      societyId,
      status: "resolved"
    });

    const allIssues = await Issue.countDocuments({ societyId });

    const avgCriticality = await Issue.aggregate([
      { $match: { societyId } },
      { $group: { _id: null, avgCriticality: { $avg: "$criticality.level" } } }
    ]);

    const stats = {
      totalMembers: society.totalMembers,
      totalVolunteers: society.totalVolunteers,
      openIssues,
      resolvedIssues,
      totalIssues: allIssues,
      resolutionRate: allIssues > 0 ? ((resolvedIssues / allIssues) * 100).toFixed(2) : 0,
      avgCriticality: avgCriticality[0]?.avgCriticality?.toFixed(2) || 0,
      lastActivityAt: society.lastActivityAt
    };

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    console.error("Get society statistics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Add community leader
exports.addCommunityLeader = async (req, res) => {
  try {
    const { societyId, userId } = req.body;

    const society = await Society.findById(societyId);

    if (!society) {
      return res.status(404).json({
        success: false,
        message: "Society not found"
      });
    }

    // Check authorization
    if (society.adminId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to perform this action"
      });
    }

    // Add to community leaders
    if (!society.communityLeaders.includes(userId)) {
      society.communityLeaders.push(userId);
      await society.save();

      // Update user role
      const user = await User.findById(userId);
      if (user) {
        user.role = "community_leader";
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Community leader added successfully"
    });
  } catch (error) {
    console.error("Add community leader error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get nearby societies
exports.getNearBySocieties = async (req, res) => {
  try {
    const { latitude, longitude, distance = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude"
      });
    }

    const societies = await Society.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    }).limit(10);

    res.status(200).json({
      success: true,
      societies
    });
  } catch (error) {
    console.error("Get nearby societies error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Search societies
exports.searchSocieties = async (req, res) => {
  try {
    const { query, city, pinCode, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ];
    }

    if (city) {
      searchQuery["address.city"] = { $regex: city, $options: "i" };
    }

    if (pinCode) {
      searchQuery["address.pinCode"] = pinCode;
    }

    const societies = await Society.find(searchQuery)
      .limit(parseInt(limit))
      .skip(skip)
      .select("name description address totalMembers totalIssuesResolved image");

    const total = await Society.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      societies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Search societies error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
