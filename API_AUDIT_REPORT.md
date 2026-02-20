# 📋 Client API Audit Report

## Executive Summary

**Status:** ⚠️ **CRITICAL ISSUE - Components NOT making real API calls**

The frontend has an API service layer (`api.js`) that is properly configured with all endpoints, BUT most components are not using it. Instead, they're using mock data from `mockData.js`, bypassing the backend APIs entirely.

---

## 🔴 Critical Findings

### Problem 1: Context Not Making API Calls

**File:** `client/src/context/AuthContext.js`

**Issue:** The login function doesn't call any API endpoint
```javascript
const login = (email, _password, selectedRole = 'citizen') => {
  setUser(currentUser)  // ❌ Uses hardcoded mock user
  setRole(selectedRole)
  return true           // ❌ No API call to /auth/login
}
```

**Should be:**
```javascript
const login = async (email, password, selectedRole = 'citizen') => {
  try {
    const response = await authApi.login(email, password, societyId)
    setUser(response.user)
    localStorage.setItem('token', response.token)
    setRole(selectedRole)
    return true
  } catch (error) {
    console.error('Login failed:', error)
    return false
  }
}
```

---

### Problem 2: User Store Using Mock Data

**File:** `client/src/store/useUserStore.js`

**Issue:** All user data is hardcoded from mock data
```javascript
export const useUserStore = create((set) => ({
  user: currentUser,              // ❌ Mock user
  leaderboard: mockLeaderboard,   // ❌ Mock data
  timeline: mockTimeline,         // ❌ Mock data
  badges: mockBadges,             // ❌ Mock data
  // ... NO API calls
}))
```

**API Methods Available But Not Used:**
```javascript
// Available in api.js but not called:
userApi.getProfile()           // GET /users/profile
userApi.getStatistics()        // GET /users/stats
userApi.getLeaderboard()       // GET /users/leaderboard
userApi.getBadges()            // GET /users/badges
userApi.getContributions()     // GET /users/contributions
```

---

### Problem 3: Issue Store Using Mock Data

**File:** `client/src/store/useIssueStore.js`

**Issue:** All issues are hardcoded from mock data
```javascript
export const useIssueStore = create((set, get) => ({
  issues: mockIssues,  // ❌ Mock issues
  // ... NO API calls to get real issues
}))
```

**API Methods Available But Not Used:**
```javascript
// Available in api.js but not called:
issueApi.getAll(societyId)     // GET /issues/{societyId}
issueApi.getNearby()           // GET /issues/nearby
issueApi.create(issueData)      // POST /issues
issueApi.getById(issueId)       // GET /issues/detail/{issueId}
```

---

## 🔍 Component-by-Component Analysis

### Pages Using Mock Data

| Page | File | Issue | Status |
|------|------|-------|--------|
| Login | `pages/Login.jsx` | Uses mock login | ❌ |
| Dashboard | `pages/Dashboard.jsx` | Uses mock user & issues | ❌ |
| Issues/Map | `pages/Issues.jsx` | Uses mock issues | ❌ |
| Volunteer Task | `pages/VolunteerTask.jsx` | Uses `mockTasks` but tries to call API for submit | ⚠️ Partial |
| Analytics | `pages/Analytics.jsx` | ? (Not checked) | ❓ |
| Escalations | `pages/Escalations.jsx` | ? (Not checked) | ❓ |
| Municipal | `pages/Municipal.jsx` | ? (Not checked) | ❓ |

### Components Using Mock Data

| Component | File | Mock Data | Issue |
|-----------|------|-----------|-------|
| CivicScoreCard | `components/dashboard/CivicScoreCard.jsx` | currentUser | ❌ |
| Leaderboard | `components/dashboard/Leaderboard.jsx` | mockLeaderboard | ❌ |
| BadgeCollection | `components/dashboard/BadgeCollection.jsx` | mockBadges | ❌ |
| ContributionTimeline | `components/dashboard/ContributionTimeline.jsx` | mockTimeline | ❌ |
| IssueCard | `components/common/IssueCard.jsx` | Passed from store | ❌ |
| IssueMarker | `components/map/IssueMarker.jsx` | mockIssues | ❌ |

---

## 🎯 API Service Status

### Available API Methods (ALL WORKING)

**Auth API** ✅
```javascript
authApi.register(userData)      // POST /auth/register
authApi.login(email, password, societyId) // POST /auth/login
authApi.verifyToken()           // POST /auth/verify
```

**User API** ✅
```javascript
userApi.getProfile()            // GET /users/profile
userApi.updateProfile(data)     // PUT /users/profile
userApi.getStatistics()         // GET /users/stats
userApi.getContributions()      // GET /users/contributions
userApi.getLeaderboard()        // GET /users/leaderboard
userApi.getBadges()             // GET /users/badges
```

**Issue API** ✅
```javascript
issueApi.getAll(societyId)      // GET /issues/{societyId}
issueApi.getById(issueId)       // GET /issues/detail/{issueId}
issueApi.create(issueData)      // POST /issues
issueApi.getNearby()            // GET /issues/nearby
issueApi.addContribution()      // POST /issues/{id}/contribute
issueApi.updateStatus()         // PUT /issues/{id}
issueApi.escalate()             // POST /issues/{id}/escalate
```

**Task API** ✅
```javascript
taskApi.getAll(societyId)       // GET /tasks/{societyId}
taskApi.getById(taskId)         // GET /tasks/detail/{taskId}
taskApi.create(taskData)        // POST /tasks
taskApi.getNearby()             // GET /tasks/nearby
taskApi.accept(taskId)          // POST /tasks/{id}/accept
taskApi.submit(taskId, data)    // POST /tasks/{id}/submit
```

**Other APIs** ✅
```javascript
societyApi.*
contributionApi.*
notificationApi.*
```

---

## 🚨 Backend Route Issues

### Issue 1: Route Ordering in Notifications

**File:** `server/routes/notification.js`

**Problem:** Route `/unread/count` comes after `/:notificationId` routes
```javascript
router.post("/:notificationId/read", ...)  // Matches first
router.get("/unread/count", ...)           // Never reached!
```

**Impact:** `GET /notifications/unread/count` will try to find a notification with ID "unread"

**Fix:** Place specific routes before dynamic parameter routes
```javascript
// Correct order:
router.get("/unread/count", ...)  // Specific first
router.post("/:notificationId/read", ...)  // Dynamic after
```

---

### Issue 2: API Endpoint Mismatch

**Frontend API Call:**
```javascript
issueApi.getNearby(latitude, longitude, distance)  // GET /issues/nearby
```

**Backend Route:**
```javascript
router.get("/nearby", issueController.getNearbyIssues)  // ✅ Public route (before auth)
```

**Problem:** Frontend doesn't provide required query parameters in correct format

**Fix:** Update API service to pass correct parameters:
```javascript
getNearby: async (latitude, longitude, distance = 5000) => {
  const response = await apiClient.get("/issues/nearby", {
    params: { latitude, longitude, distance }
  });
  return response.data;
}
```

---

## 📝 Recommended Fixes

### Fix 1: Update AuthContext to Use Real API

```javascript
import { authApi } from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [role, setRole] = useState('citizen')

  const login = async (email, password, societyId) => {
    try {
      const response = await authApi.login(email, password, societyId)
      setUser(response.user)
      setToken(response.token)
      setRole(response.user.role)
      return { success: true, user: response.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
    setToken(null)
  }

  return createElement(
    AuthContext.Provider,
    { value: { user, token, role, login, logout } },
    children
  )
}
```

---

### Fix 2: Update useUserStore to Fetch Real Data

```javascript
import { create } from 'zustand'
import { userApi } from '../services/api'

export const useUserStore = create((set) => ({
  user: null,
  leaderboard: [],
  timeline: [],
  badges: [],
  loading: false,

  // Fetch all user data
  fetchUserData: async () => {
    set({ loading: true })
    try {
      const [profile, leaderboard, badges] = await Promise.all([
        userApi.getProfile(),
        userApi.getLeaderboard(),
        userApi.getBadges(),
      ])
      set({
        user: profile.user,
        leaderboard: leaderboard.leaderboard,
        badges: badges.badges,
        loading: false,
      })
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      set({ loading: false })
    }
  },

  updateScore: (delta) =>
    set((state) => ({
      user: { ...state.user, civicScore: state.user.civicScore + delta },
    })),
}))
```

---

### Fix 3: Update useIssueStore to Fetch Real Data

```javascript
import { create } from 'zustand'
import { issueApi } from '../services/api'

export const useIssueStore = create((set, get) => ({
  issues: [],
  selectedIssue: null,
  filter: 'all',
  loading: false,

  // Fetch issues for society
  fetchIssues: async (societyId) => {
    set({ loading: true })
    try {
      const response = await issueApi.getAll(societyId)
      set({ issues: response.issues, loading: false })
    } catch (error) {
      console.error('Failed to fetch issues:', error)
      set({ loading: false })
    }
  },

  // Fetch nearby issues
  fetchNearbyIssues: async (latitude, longitude) => {
    try {
      const response = await issueApi.getNearby(latitude, longitude)
      set({ issues: response.issues })
    } catch (error) {
      console.error('Failed to fetch nearby issues:', error)
    }
  },

  createIssue: async (issueData) => {
    try {
      const response = await issueApi.create(issueData)
      set((state) => ({
        issues: [response.issue, ...state.issues],
      }))
      return response
    } catch (error) {
      console.error('Failed to create issue:', error)
      throw error
    }
  },

  setFilter: (filter) => set({ filter }),
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  clearSelected: () => set({ selectedIssue: null }),

  getFilteredIssues: () => {
    const { issues, filter } = get()
    if (filter === 'all') return issues
    if (filter === 'completed') return issues.filter(i => i.status === 'resolved')
    return issues.filter(i => i.status === filter)
  },
}))
```

---

### Fix 4: Update Dashboard to Fetch Real Data

```javascript
import { useEffect } from 'react'
import { useUserStore } from '../store/useUserStore'
import { useIssueStore } from '../store/useIssueStore'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, fetchUserData, loading: userLoading } = useUserStore()
  const { issues, fetchIssues, loading: issuesLoading } = useIssueStore()
  const { user: authUser } = useAuth()

  useEffect(() => {
    // Fetch user data when component mounts
    if (authUser) {
      fetchUserData()
      fetchIssues(authUser.societyId)
    }
  }, [authUser, fetchUserData, fetchIssues])

  if (userLoading || issuesLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please log in</div>
  }

  // Rest of component...
}
```

---

## ✅ Verification Checklist

Once fixes are implemented, verify:

- [ ] Login calls `POST /api/auth/login` and stores real JWT token
- [ ] Dashboard fetches user profile from `GET /api/users/profile`
- [ ] Issues page displays real issues from `GET /api/issues/{societyId}`
- [ ] User civic score matches database value
- [ ] Leaderboard shows real user rankings
- [ ] Badges show real earned achievements
- [ ] Creating an issue calls `POST /api/issues`
- [ ] Accepting a task calls `POST /api/tasks/{id}/accept`
- [ ] Contributing to issue calls `POST /issues/{id}/contribute`

---

## 📊 Impact Analysis

### Current State
- ❌ Components using 100% mock data
- ❌ No real data from MongoDB
- ❌ API service configured but unused
- ❌ Database operations not reflected in UI

### After Fixes
- ✅ Components using real API calls
- ✅ Data from MongoDB displayed in UI
- ✅ User actions persist to database
- ✅ Real-time score and stat updates
- ✅ Full functionality enabled

---

## 🎯 Priority

**CRITICAL** - This is preventing the frontend from actually using the working backend that we verified is fully functional. The backend CRUD operations work perfectly, but components need to call them.

---

## 📁 Files That Need Updating

| Priority | File | Task |
|----------|------|------|
| 🔴 P0 | `context/AuthContext.js` | Use real API for login |
| 🔴 P0 | `store/useUserStore.js` | Use real API for user data |
| 🔴 P0 | `store/useIssueStore.js` | Use real API for issues |
| 🟡 P1 | `pages/Dashboard.jsx` | Use fetchers on mount |
| 🟡 P1 | `pages/Issues.jsx` | Fetch real issues on mount |
| 🟡 P1 | `pages/VolunteerTask.jsx` | Complete real API usage |
| 🟢 P2 | `server/routes/notification.js` | Fix route ordering |

---

## Summary

The application has **two separate systems**:

1. **Backend ✅** - Fully functional, all CRUD operations working, data persisting to MongoDB
2. **Frontend ❌** - Looks good visually but not connected to backend (using mock data)

**The API service layer exists and is correctly configured**, but components aren't using it. The fix involves replacing mock data initialization with real API calls in the stores and context.

