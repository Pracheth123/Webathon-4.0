import { create } from 'zustand'
import { currentUser, mockLeaderboard, mockTimeline, mockBadges } from '../data/mockData'

export const useUserStore = create((set) => ({
  user: currentUser,
  leaderboard: mockLeaderboard,
  timeline: mockTimeline,
  badges: mockBadges,

  updateScore: (delta) =>
    set((state) => ({
      user: { ...state.user, civicScore: state.user.civicScore + delta },
    })),

  addTimelineEntry: (entry) =>
    set((state) => ({
      timeline: [entry, ...state.timeline],
    })),
}))
