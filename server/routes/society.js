const express = require("express");
const societyController = require("../controllers/societyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/nearby", societyController.getNearBySocieties);
router.get("/search", societyController.searchSocieties);

// Protected routes
router.use(authMiddleware);

router.post("/", societyController.createSociety);
router.get("/:societyId", societyController.getSociety);
router.put("/:societyId", societyController.updateSociety);
router.get("/:societyId/members", societyController.getSocietyMembers);
router.get("/:societyId/stats", societyController.getSocietyStatistics);
router.post("/:societyId/leaders", societyController.addCommunityLeader);

module.exports = router;
