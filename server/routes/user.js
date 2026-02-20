const express = require('express')
const router = express.Router()
const { mockAnalytics } = require('../data/mockData')

// GET /api/users/stats
router.get('/stats', (req, res) => {
  res.json({ success: true, data: mockAnalytics })
})

// GET /api/users/leaderboard
router.get('/leaderboard', (req, res) => {
  // Minimal placeholder response
  res.json({ success: true, data: [] })
})

// GET /api/users/badges
router.get('/badges', (req, res) => {
  res.json({ success: true, data: [] })
})

module.exports = router
