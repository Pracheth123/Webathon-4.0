# 🔧 Code Fix Guide - Before & After

## File 1: `client/src/context/AuthContext.js`

### ❌ BEFORE (Using Mock Data)
```javascript
import { createContext, useContext, useState, createElement } from 'react'
import { currentUser } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUser)
  const [role, setRole] = useState('citizen')

  const login = (email, _password, selectedRole = 'citizen') => {
    setUser(currentUser)      // ❌ Always returns mock user
    setRole(selectedRole)
    return true
  }

  const logout = () => {
    setUser(null)
    setRole('citizen')
  }

  return createElement(
    AuthContext.Provider,
    { value: { user, role, login, logout, setRole } },
    children
  )
}

export const useAuth = () => useContext(AuthContext)
```

### ✅ AFTER (Using Real API)
```javascript
import { createContext, useContext, useState, createElement } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [role, setRole] = useState('citizen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async (email, password, societyId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authApi.login(email, password, societyId)
      setUser(response.user)
      setToken(response.token)
      setRole(response.user.role)
      return { success: true, user: response.user }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setToken(null)
    setRole('citizen')
  }

  const verifyToken = async () => {
    try {
      const response = await authApi.verifyToken()
      return response.success
    } catch {
      logout()
      return false
    }
  }

  return createElement(
    AuthContext.Provider,
    {
      value: {
        user,
        token,
        role,
        login,
        logout,
        setRole,
        loading,
        error,
        isAuthenticated: !!user && !!token,
        verifyToken
      }
    },
    children
  )
}

export const useAuth = () => useContext(AuthContext)
```

**Changes:**
- Added API import: `import { authApi } from '../services/api'`
- Changed login to async and call real API
- Added token storage
- Added loading and error states
- Added verifyToken method
- Login returns actual response from API

---

## File 2: `client/src/store/useUserStore.js`

### ❌ BEFORE (Mock Data)
```javascript
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
```

### ✅ AFTER (Real API Calls)
```javascript
import { create } from 'zustand'
import { userApi, issueApi, taskApi } from '../services/api'

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
      set({ error: error.message, loading: false })
      throw error
    }
  },

  // Fetch leaderboard from API
  fetchLeaderboard: async () => {
    try {
      const response = await userApi.getLeaderboard()
      set({ leaderboard: response.leaderboard || [response] })
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }
  },

  // Fetch user badges from API
  fetchBadges: async () => {
    try {
      const response = await userApi.getBadges()
      set({ badges: response.badges || [] })
    } catch (error) {
      console.error('Failed to fetch badges:', error)
    }
  },

  // Fetch user contributions from API
  fetchContributions: async () => {
    try {
      const response = await userApi.getContributions()
      set({ contributions: response.contributions || [] })
    } catch (error) {
      console.error('Failed to fetch contributions:', error)
    }
  },

  // Fetch all user data at once
  fetchAllUserData: async () => {
    set({ loading: true })
    try {
      await Promise.all([
        get().fetchProfile(),
        get().fetchLeaderboard(),
        get().fetchBadges(),
        get().fetchContributions(),
      ])
      set({ loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
      throw error
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await userApi.updateProfile(profileData)
      set({ user: response.user })
      return response.user
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Local update for immediate UI feedback
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
    }),
}))
```

**Changes:**
- Import `userApi` from services
- Replace mock data with null/empty arrays
- Add async methods for each data type
- Add `fetchAllUserData()` to load everything
- Add loading and error states
- Keep local update methods for UI optimization
- Add `clearUserData()` for logout

---

## File 3: `client/src/store/useIssueStore.js`

### ❌ BEFORE (Mock Data)
```javascript
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
```

### ✅ AFTER (Real API Calls)
```javascript
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
      set({ issues: response.issues || [], loading: false })
      return response.issues
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Failed to fetch issues:', error)
      throw error
    }
  },

  // Fetch nearby issues
  fetchNearbyIssues: async (latitude, longitude, distance = 5000) => {
    set({ loading: true })
    try {
      const response = await issueApi.getNearby(latitude, longitude, distance)
      set({ issues: response.issues || [], loading: false })
      return response.issues
    } catch (error) {
      set({ error: error.message, loading: false })
      console.error('Failed to fetch nearby issues:', error)
    }
  },

  // Fetch single issue
  fetchIssueById: async (issueId) => {
    try {
      const response = await issueApi.getById(issueId)
      set({ selectedIssue: response.issue })
      return response.issue
    } catch (error) {
      console.error('Failed to fetch issue:', error)
      throw error
    }
  },

  // Create new issue
  createIssue: async (issueData) => {
    try {
      const response = await issueApi.create(issueData)
      // Add new issue to front of list
      set((state) => ({
        issues: [response.issue, ...state.issues],
      }))
      return response.issue
    } catch (error) {
      set({ error: error.message })
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
          issue._id === issueId
            ? { ...issue, contributions: response.contributions }
            : issue
        ),
      }))
      return response
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Update issue status
  updateIssueStatus: async (issueId, status, notes = '') => {
    try {
      const response = await issueApi.updateStatus(issueId, status, notes)
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue._id === issueId ? response.issue : issue
        ),
      }))
      return response.issue
    } catch (error) {
      set({ error: error.message })
      throw error
    }
  },

  // Escalate issue
  escalateIssue: async (issueId, reason) => {
    try {
      const response = await issueApi.escalate(issueId, reason)
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue._id === issueId ? response.issue : issue
        ),
      }))
      return response.issue
    } catch (error) {
      set({ error: error.message })
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
    return issues.filter(i => i.status === filter)
  },

  getPrioritySorted: () => {
    return [...get().issues]
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
    }),
}))
```

**Changes:**
- Import `issueApi` from services
- Replace mock issues with empty array
- Add async methods for API calls
- Add loading and error states
- Support filtering by API response
- Add methods for all issue operations
- Update filtering logic to match backend status values

---

## File 4: `client/src/pages/Dashboard.jsx`

### ❌ BEFORE (Mock Data Only)
```javascript
import { useUserStore } from '../store/useUserStore'
import { useIssueStore } from '../store/useIssueStore'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, leaderboard, timeline, badges } = useUserStore()
  const { issues } = useIssueStore()
  const { user: authUser } = useAuth()

  // No data fetching - just uses initial mock data!

  return (
    // ... JSX
  )
}
```

### ✅ AFTER (Fetch Real Data)
```javascript
import { useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import { useIssueStore } from '../store/useIssueStore'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, leaderboard, timeline, badges, fetchAllUserData, loading: userLoading } = useUserStore()
  const { issues, fetchIssues, loading: issuesLoading } = useIssueStore()
  const { user: authUser } = useAuth()

  // Fetch data when component mounts
  useEffect(() => {
    if (authUser?.id) {
      // Fetch user profile, leaderboard, and badges
      fetchAllUserData()

      // Fetch issues for the user's society
      if (authUser.societyId) {
        fetchIssues(authUser.societyId)
      }
    }
  }, [authUser, fetchAllUserData, fetchIssues])

  // Show loading state
  if (userLoading || issuesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error or empty state
  if (!user) {
    return <div className="text-center py-8">Please log in to view dashboard</div>
  }

  return (
    // ... JSX (same as before, now with REAL data)
  )
}
```

**Changes:**
- Add `useEffect` to fetch data on mount
- Call `fetchAllUserData()` to load user profile, leaderboard, badges
- Call `fetchIssues()` to load society's issues
- Add loading state handling
- Add error handling

---

## File 5: `client/src/pages/Issues.jsx`

### ❌ BEFORE
```javascript
export default function Issues() {
  const { issues, filter, setFilter, getFilteredIssues } = useIssueStore()
  // Filtered issues come from mock data
  const filtered = getFilteredIssues()
  // ...
}
```

### ✅ AFTER
```javascript
import { useEffect } from 'react'

export default function Issues() {
  const { issues, filter, setFilter, getFilteredIssues, fetchIssues, loading } = useIssueStore()
  const { user: authUser } = useAuth()

  // Fetch issues when component mounts
  useEffect(() => {
    if (authUser?.societyId) {
      fetchIssues(authUser.societyId)
    }
  }, [authUser?.societyId, fetchIssues])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading issues...</div>
  }

  const filtered = getFilteredIssues()

  return (
    // ... JSX (same, but with REAL data)
  )
}
```

**Changes:**
- Add `useEffect` to fetch issues on mount
- Add loading state check
- Rest of component remains the same

---

## File 6: `server/routes/notification.js` (Backend Fix)

### ❌ BEFORE (Wrong Route Order)
```javascript
router.get("/", notificationController.getUserNotifications);
router.post("/:notificationId/read", notificationController.markAsRead);
router.post("/read-all", notificationController.markAllAsRead);
router.post("/:notificationId/archive", notificationController.archiveNotification);
router.delete("/:notificationId", notificationController.deleteNotification);
router.get("/unread/count", notificationController.getUnreadCount);  // ❌ Never reached!
```

### ✅ AFTER (Fixed Route Order)
```javascript
// Specific routes first
router.get("/unread/count", notificationController.getUnreadCount);
router.post("/read-all", notificationController.markAllAsRead);
router.get("/by-type/:type", notificationController.getNotificationsByType);

// Dynamic routes after
router.get("/", notificationController.getUserNotifications);
router.post("/:notificationId/read", notificationController.markAsRead);
router.post("/:notificationId/archive", notificationController.archiveNotification);
router.delete("/:notificationId", notificationController.deleteNotification);
```

**Changes:**
- Move specific routes `/unread/count` and `/read-all` BEFORE `/:notificationId` routes
- This ensures Express matches specific routes first, then dynamic ones

---

## Summary of Changes

| File | Type | Change |
|------|------|--------|
| AuthContext.js | Context | Make login async and call API |
| useUserStore.js | Store | Add async fetch methods for real API data |
| useIssueStore.js | Store | Add async fetch methods for real API data |
| Dashboard.jsx | Page | Add useEffect to fetch on mount |
| Issues.jsx | Page | Add useEffect to fetch on mount |
| VolunteerTask.jsx | Page | Already partially implemented, just ensure all task ops use API |
| notification.js | Routes | Fix route ordering (specific before dynamic) |

---

## Testing After Changes

1. **Login Page**
   - Enter real credentials
   - Verify token stored in localStorage
   - Check browser Network tab for `POST /api/auth/login`

2. **Dashboard Page**
   - Check for API calls to fetch profile, leaderboard, badges
   - Verify data matches MongoDB
   - Network tab should show multiple API calls

3. **Issues Page**
   - Check for `GET /api/issues/{societyId}` call
   - Verify real issues display on map
   - Create new issue and verify it appears

4. **Volunteer Task**
   - Accept task should call `POST /api/tasks/{id}/accept`
   - Submit task should call `POST /api/tasks/{id}/submit`
   - Verify changes in database

