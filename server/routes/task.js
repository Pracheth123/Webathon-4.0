const express = require('express')
const router = express.Router()
const { mockTasks } = require('../data/mockData')

// GET /api/tasks/detail/:taskId
router.get('/detail/:taskId', (req, res) => {
  const { taskId } = req.params
  const task = mockTasks.find((t) => t.id === taskId)
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
  res.json({ success: true, data: task })
})

// GET /api/tasks/issue/:issueId
router.get('/issue/:issueId', (req, res) => {
  const { issueId } = req.params
  const tasks = mockTasks.filter((t) => t.issueId === issueId)
  res.json({ success: true, data: tasks })
})

// POST /api/tasks/:taskId/submit
router.post('/:taskId/submit', (req, res) => {
  const { taskId } = req.params
  const task = mockTasks.find((t) => t.id === taskId)
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' })
  // For development, return a simple success payload
  return res.json({ success: true, data: { credits: task.credits, xp: 200, message: 'Submission received' } })
})

module.exports = router
