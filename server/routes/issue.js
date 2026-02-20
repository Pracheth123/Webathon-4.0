const express = require("express");
const issueController = require("../controllers/issueController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public route
router.get("/nearby", issueController.getNearbyIssues);

// Protected routes
router.use(authMiddleware);

router.post("/", issueController.createIssue);
router.get("/:societyId", issueController.getIssues);
router.get("/detail/:issueId", issueController.getIssueById);
router.post("/:issueId/contribute", issueController.addContribution);
router.put("/:issueId", issueController.updateIssueStatus);
router.post("/:issueId/escalate", issueController.escalateIssue);

module.exports = router;
