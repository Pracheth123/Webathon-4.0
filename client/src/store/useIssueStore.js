import { create } from 'zustand'
import { issueApi } from '../services/api'

export const useIssueStore = create((set, get) => ({
  // State
  issues: [],
  selectedIssue: null,
  filter: 'all',
  loading: false,
  error: null,

  // Fetch all issues for a society
  fetchIssues: async (societyId, filters = {}) => {
    set({ loading: true, error: null })
    try {
      const response = await issueApi.getAll(societyId, filters)
      const issues = Array.isArray(response) ? response : (response.issues || [])
      set({ issues, loading: false })
      return issues
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage, loading: false, issues: [] })
      console.error('Failed to fetch issues:', error)
      return []
    }
  },

  // Fetch nearby issues
  fetchNearbyIssues: async (latitude, longitude, distance = 5000) => {
    set({ loading: true })
    try {
      const response = await issueApi.getNearby(latitude, longitude, distance)
      const issues = Array.isArray(response) ? response : (response.issues || [])
      set({ issues, loading: false })
      return issues
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage, loading: false, issues: [] })
      console.error('Failed to fetch nearby issues:', error)
      return []
    }
  },

  // Fetch single issue
  fetchIssueById: async (issueId) => {
    try {
      const response = await issueApi.getById(issueId)
      const issue = response.issue || response
      set({ selectedIssue: issue })
      return issue
    } catch (error) {
      console.error('Failed to fetch issue:', error)
      throw error
    }
  },

  // Create new issue
  createIssue: async (issueData) => {
    try {
      const response = await issueApi.create(issueData)
      const newIssue = response.issue || response
      // Add new issue to front of list
      set((state) => ({
        issues: [newIssue, ...state.issues],
      }))
      return newIssue
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage })
      throw error
    }
  },

  // Add contribution to issue
  addContribution: async (issueId, contributionData) => {
    try {
      const response = await issueApi.addContribution(issueId, contributionData)
      // Update the issue in the list
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue._id === issueId || issue.id === issueId
            ? { ...issue, contributions: response.contributions || issue.contributions }
            : issue
        ),
      }))
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage })
      throw error
    }
  },

  // Update issue status
  updateIssueStatus: async (issueId, status, notes = '') => {
    try {
      const response = await issueApi.updateStatus(issueId, status, notes)
      const updatedIssue = response.issue || response
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue._id === issueId || issue.id === issueId ? updatedIssue : issue
        ),
      }))
      return updatedIssue
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage })
      throw error
    }
  },

  // Escalate issue
  escalateIssue: async (issueId, reason) => {
    try {
      const response = await issueApi.escalate(issueId, reason)
      const escalatedIssue = response.issue || response
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue._id === issueId || issue.id === issueId ? escalatedIssue : issue
        ),
      }))
      return escalatedIssue
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage })
      throw error
    }
  },

  // UI State management
  setFilter: (filter) => set({ filter }),
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  clearSelected: () => set({ selectedIssue: null }),

  // Filtering logic
  getFilteredIssues: () => {
    const { issues, filter } = get()
    if (filter === 'all') return issues
    if (filter === 'completed') return issues.filter(i => i.status === 'resolved')
    if (filter === 'in_progress') return issues.filter(i => i.status === 'in-progress')
    // Filter by severity (critical, high, medium, low)
    return issues.filter(i => i.status === filter || i.severity === filter)
  },

  getPrioritySorted: () => {
    const issues = get().issues
    return [...issues]
      .filter(i => i.status !== 'resolved')
      .sort((a, b) => {
        const priorityMap = { critical: 4, high: 3, medium: 2, low: 1 }
        return (priorityMap[b.severity] || 0) - (priorityMap[a.severity] || 0)
      })
  },

  getEscalatedIssues: () => {
    return get().issues.filter((i) => i.status === 'under-review')
  },

  // Clear data (on logout)
  clearIssueData: () =>
    set({
      issues: [],
      selectedIssue: null,
      filter: 'all',
      error: null,
      loading: false,
    }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),
}))

