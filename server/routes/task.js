const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public route
router.get("/nearby", taskController.getNearbyTasks);

// Protected routes
router.use(authMiddleware);

router.post("/", taskController.createTask);
router.get("/:societyId", taskController.getTasks);
router.get("/detail/:taskId", taskController.getTaskById);
router.post("/:taskId/accept", taskController.acceptTask);
router.post("/:taskId/submit", taskController.submitTask);
router.post("/:taskId/verify", taskController.verifyTask);
router.get("/my/assignments", taskController.getUserTaskAssignments);

module.exports = router;
