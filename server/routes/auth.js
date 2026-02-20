const express = require('express')
const router = express.Router()

router.post('/register', (req, res) => res.json({ success: true }))
router.post('/login', (req, res) => res.json({ success: true, token: null }))
router.post('/verify', (req, res) => res.json({ success: true }))

module.exports = router
