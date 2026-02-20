import { create } from 'zustand'
import { userApi } from '../services/api'

export const useUserStore = create((set, get) => ({
  // State
  user: null,
  leaderboard: [],
  timeline: [],
  badges: [],
  contributions: [],
  loading: false,
  error: null,

  // Fetch user profile from API
  fetchProfile: async () => {
    set({ loading: true, error: null })
    try {
      const response = await userApi.getProfile()
      set({ user: response.user, loading: false })
      return response.user
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage, loading: false })
      console.error('Failed to fetch profile:', error)
      throw error
    }
  },

  // Fetch leaderboard from API
  fetchLeaderboard: async () => {
    try {
      const response = await userApi.getLeaderboard()
      // Handle both array response and single object
      const leaderboard = Array.isArray(response) ? response : (response.leaderboard || [])
      set({ leaderboard })
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      set({ leaderboard: [] })
    }
  },

  // Fetch user badges from API
  fetchBadges: async () => {
    try {
      const response = await userApi.getBadges()
      const badges = Array.isArray(response) ? response : (response.badges || [])
      set({ badges })
    } catch (error) {
      console.error('Failed to fetch badges:', error)
      set({ badges: [] })
    }
  },

  // Fetch user contributions from API
  fetchContributions: async () => {
    try {
      const response = await userApi.getContributions()
      const contributions = Array.isArray(response) ? response : (response.contributions || [])
      set({ contributions, timeline: contributions })
    } catch (error) {
      console.error('Failed to fetch contributions:', error)
      set({ contributions: [], timeline: [] })
    }
  },

  // Fetch all user data at once
  fetchAllUserData: async () => {
    set({ loading: true })
    try {
      const [profile, leaderboard, badges, contributions] = await Promise.all([
        userApi.getProfile().catch(err => {
          console.error('Profile fetch failed:', err)
          return { user: null }
        }),
        userApi.getLeaderboard().catch(err => {
          console.error('Leaderboard fetch failed:', err)
          return []
        }),
        userApi.getBadges().catch(err => {
          console.error('Badges fetch failed:', err)
          return []
        }),
        userApi.getContributions().catch(err => {
          console.error('Contributions fetch failed:', err)
          return []
        }),
      ])

      const leaderboardData = Array.isArray(leaderboard) ? leaderboard : (leaderboard.leaderboard || [])
      const badgesData = Array.isArray(badges) ? badges : (badges.badges || [])
      const contributionsData = Array.isArray(contributions) ? contributions : (contributions.contributions || [])

      set({
        user: profile.user,
        leaderboard: leaderboardData,
        badges: badgesData,
        contributions: contributionsData,
        timeline: contributionsData,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch all user data:', error)
      set({ loading: false, error: error.message })
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await userApi.updateProfile(profileData)
      set({ user: response.user })
      return response.user
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message
      set({ error: errorMessage })
      throw error
    }
  },

  // Local update for immediate UI feedback (optimistic update)
  updateScore: (delta) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, civicScore: state.user.civicScore + delta }
        : state.user,
    })),

  addTimelineEntry: (entry) =>
    set((state) => ({
      timeline: [entry, ...state.timeline],
    })),

  // Clear user data (on logout)
  clearUserData: () =>
    set({
      user: null,
      leaderboard: [],
      timeline: [],
      badges: [],
      contributions: [],
      error: null,
      loading: false,
    }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),
}))

