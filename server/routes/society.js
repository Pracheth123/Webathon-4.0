const express = require('express')
const router = express.Router()

router.get('/:societyId', (req, res) => res.json({ success: true, data: {} }))
router.get('/:societyId/members', (req, res) => res.json({ success: true, data: [] }))
router.get('/search', (req, res) => res.json({ success: true, data: [] }))

module.exports = router
