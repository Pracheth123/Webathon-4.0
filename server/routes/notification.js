const express = require('express')
const router = express.Router()

router.get('/', (req, res) => res.json({ success: true, data: [] }))
router.post('/:id/read', (req, res) => res.json({ success: true }))
router.post('/read-all', (req, res) => res.json({ success: true }))

module.exports = router
