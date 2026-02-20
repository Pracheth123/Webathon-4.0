const express = require('express')
const router = express.Router()

router.get('/issue/:issueId', (req, res) => res.json({ success: true, data: [] }))
router.post('/:id/verify', (req, res) => res.json({ success: true }))

module.exports = router
module.exports = router
