const express = require("express");
const analysisController = require("../controllers/analysisController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create analysis (after Gemini API analysis)
router.post("/", analysisController.analyzeIssue);

// Get analysis
router.get("/issue/:issueId", analysisController.getAnalysisByIssue);

// Verify analysis (community leaders & municipal officials only)
router.post(
  "/:analysisId/verify",
  authorize("community_leader", "municipal_official"),
  analysisController.verifyAnalysis
);

// Get metrics
router.get("/metrics/:societyId", analysisController.getAnalysisMetrics);

// Get unverified (for review)
router.get(
  "/unverified/list",
  authorize("community_leader", "municipal_official"),
  analysisController.getUnverifiedAnalyses
);

module.exports = router;
