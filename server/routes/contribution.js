const express = require("express");
const contributionController = require("../controllers/contributionController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", contributionController.createContribution);
router.get("/issue/:issueId", contributionController.getContributionsByIssue);
router.get("/user/:userId", contributionController.getUserContributions);
router.post("/:contributionId/verify",
  authorize("community_leader", "municipal_official"),
  contributionController.verifyContribution
);
router.post("/:contributionId/rate", contributionController.rateContribution);

// Admin/Leaders only
router.get("/pending/:societyId",
  authorize("community_leader", "municipal_official"),
  contributionController.getPendingContributions
);
router.get("/stats/:societyId",
  authorize("community_leader", "municipal_official"),
  contributionController.getContributionStats
);

module.exports = router;
