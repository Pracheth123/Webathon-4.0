const Task = require("../models/Task");
const User = require("../models/User");
const Society = require("../models/Society");
const Notification = require("../models/Notification");

// Create new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      requirements,
      estimatedTime,
      difficulty,
      latitude,
      longitude,
      address,
      radius,
      deadline,
      priority,
      pointsReward,
      relatedIssueId
    } = req.body;

    // Validation
    if (!title || !description || !type || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    const user = await User.findById(req.user.id);

    // Create task
    const task = new Task({
      title,
      description,
      type,
      category,
      requirements: requirements || [],
      estimatedTime: estimatedTime || 15,
      difficulty: difficulty || "easy",
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
        address,
        radius: radius || 500
      },
      societyId: user.societyId,
      assignedBy: req.user.id,
      relatedIssueId,
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
      priority: priority || "medium",
      rewards: {
        points: pointsReward || 10
      }
    });

    await task.save();

    // Notify volunteers
    const volunteers = await User.find({
      societyId: user.societyId,
      role: "volunteer"
    });

    for (const volunteer of volunteers) {
      await Notification.create({
        recipientId: volunteer._id,
        recipientEmail: volunteer.email,
        recipientRole: volunteer.role,
        entityType: "task",
        entityId: task._id,
        societyId: user.societyId,
        type: "task_assigned",
        subject: `New Task: ${title}`,
        message: `A new task is available: ${title}`,
        actionUrl: `/task/${task._id}`,
        priority: priority || "normal"
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: {
        id: task._id,
        title: task.title,
        location: task.location,
        difficulty: task.difficulty,
        deadline: task.deadline
      }
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all tasks for a society
exports.getTasks = async (req, res) => {
  try {
    const { societyId } = req.params;
    const { status = "open", page = 1, limit = 10, sortBy = "-priority" } = req.query;

    const skip = (page - 1) * limit;
    const query = { societyId, status };

    const tasks = await Task.find(query)
      .populate("assignedBy", "name avatar")
      .populate("relatedIssueId", "title")
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate("assignedBy", "name avatar")
      .populate("relatedIssueId", "title description image")
      .populate("assignments.userId", "name avatar civicScore")
      .populate("assignments.approvedBy", "name");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    console.error("Get task by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Accept task assignment
exports.acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Check if user already assigned
    const existingAssignment = task.assignments.find(
      a => a.userId?.toString() === req.user.id
    );

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "You have already accepted this task"
      });
    }

    // Add assignment
    task.assignments.push({
      userId: req.user.id,
      assignedAt: new Date(),
      status: "in-progress"
    });

    task.totalAssignments += 1;
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task accepted successfully"
    });
  } catch (error) {
    console.error("Accept task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Submit task
exports.submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description, images, latitude, longitude } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Find user's assignment
    const assignment = task.assignments.find(
      a => a.userId?.toString() === req.user.id
    );

    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: "You haven't accepted this task"
      });
    }

    // Update assignment
    assignment.status = "submitted";
    assignment.submittedAt = new Date();
    assignment.submissionData = {
      description,
      images: images || [],
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      }
    };

    task.status = "completed";
    await task.save();

    // Notify task creator for verification
    await Notification.create({
      recipientId: task.assignedBy,
      entityType: "task",
      entityId: taskId,
      societyId: task.societyId,
      type: "task_completed",
      subject: `Task Submitted: ${task.title}`,
      message: `A volunteer has submitted a task: ${task.title}`,
      priority: "normal"
    });

    res.status(200).json({
      success: true,
      message: "Task submitted successfully"
    });
  } catch (error) {
    console.error("Submit task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Verify task submission
exports.verifyTask = async (req, res) => {
  try {
    const { taskId, userId, status, notes } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // Check authorization
    if (task.assignedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to verify this task"
      });
    }

    // Find assignment
    const assignment = task.assignments.find(a => a.userId?.toString() === userId);

    if (!assignment) {
      return res.status(400).json({
        success: false,
        message: "Assignment not found"
      });
    }

    assignment.status = status; // approved or rejected
    assignment.approvedAt = new Date();
    assignment.approvedBy = req.user.id;

    if (status === "approved") {
      task.completedAssignments += 1;
      task.completionRate = ((task.completedAssignments / task.totalAssignments) * 100).toFixed(2);

      // Award points to user
      const user = await User.findById(userId);
      if (user) {
        user.tasksCompleted += 1;
        user.civicScore += task.rewards.points || 10;
        user.reliabilityScore = Math.min(user.reliabilityScore + 5, 100);
        await user.save();
      }
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task verification completed",
      task
    });
  } catch (error) {
    console.error("Verify task error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get nearby tasks for user
exports.getNearbyTasks = async (req, res) => {
  try {
    const { latitude, longitude, distance = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Please provide latitude and longitude"
      });
    }

    const user = await User.findById(req.user.id);

    const tasks = await Task.find({
      societyId: user.societyId,
      status: "open",
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
      tasks
    });
  } catch (error) {
    console.error("Get nearby tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get user's task assignments
exports.getUserTaskAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const tasks = await Task.find({
      "assignments.userId": req.user.id
    })
      .populate("assignedBy", "name")
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments({
      "assignments.userId": req.user.id
    });

    res.status(200).json({
      success: true,
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get user task assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
