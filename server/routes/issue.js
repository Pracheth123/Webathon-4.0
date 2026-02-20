const express = require('express')
const router = express.Router()

// Minimal placeholder endpoints for issues
router.get('/:societyId', (req, res) => res.json({ success: true, data: [] }))
router.get('/detail/:issueId', (req, res) => res.json({ success: true, data: null }))
router.post('/', (req, res) => res.json({ success: true }))

module.exports = router
