import { create } from 'zustand'
import { mockIssues } from '../data/mockData'

export const useIssueStore = create((set, get) => ({
  issues: mockIssues,
  selectedIssue: null,
  filter: 'all',

  setFilter: (filter) => set({ filter }),
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  clearSelected: () => set({ selectedIssue: null }),

  getFilteredIssues: () => {
    const { issues, filter } = get()
    if (filter === 'all') return issues
    if (filter === 'completed') return issues.filter(i => i.status === 'completed')
    return issues.filter(i => i.severity === filter)
  },

  getPrioritySorted: () => {
    return [...get().issues]
      .filter(i => i.status !== 'completed')
      .sort((a, b) => b.priority - a.priority)
  },

  getEscalatedIssues: () => {
    return get().issues.filter((i) => i.escalatedTo === 'municipal')
  },
}))
