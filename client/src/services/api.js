import { mockIssues, mockUsers, mockTasks, mockAnalytics } from '../data/mockData'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  issues: {
    getAll: async (filters = {}) => {
      await delay(300)
      let data = [...mockIssues]
      if (filters.severity) data = data.filter((i) => i.severity === filters.severity)
      if (filters.status) data = data.filter((i) => i.status === filters.status)
      return { data, total: data.length }
    },
    getById: async (id) => {
      await delay(200)
      return mockIssues.find((i) => i.id === id) || null
    },
    create: async (issue) => {
      await delay(500)
      return { ...issue, id: Date.now().toString(), status: 'open', priority: 50 }
    },
    escalate: async (id) => {
      await delay(400)
      return { success: true, message: `Issue #${id} escalated to city corporation.` }
    },
    verify: async (id) => {
      await delay(300)
      return { success: true, message: 'Issue verification recorded.' }
    },
  },

  tasks: {
    getAll: async () => {
      await delay(200)
      return mockTasks
    },
    getByIssueId: async (issueId) => {
      await delay(200)
      return mockTasks.filter((t) => t.issueId === issueId)
    },
    getById: async (id) => {
      await delay(200)
      return mockTasks.find((t) => t.id === id) || null
    },
    submit: async (_taskId, _data) => {
      await delay(900)
      return { success: true, credits: 150, xp: 200, message: 'Task completed successfully!' }
    },
  },

  users: {
    getCurrent: async () => {
      await delay(200)
      return mockUsers[0]
    },
    getLeaderboard: async () => {
      await delay(300)
      return mockUsers
    },
  },

  analytics: {
    getStats: async () => {
      await delay(400)
      return mockAnalytics
    },
  },
}
