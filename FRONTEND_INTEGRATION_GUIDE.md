# Frontend-Backend Integration Guide

## Frontend API Service Setup

### 1. Update Frontend .env
```
# client/.env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_key_if_using_frontend_analysis
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## Frontend Service Layer (To Update)

### Update `client/src/services/api.js`
```javascript
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Frontend Service Files to Create

### 1. `client/src/services/authService.js`
```javascript
import api from "./api";

export const authService = {
  register: async (formData) => {
    const response = await api.post("/auth/register", formData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  login: async (email, password, societyId) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      societyId
    });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  }
};

export default authService;
```

### 2. `client/src/services/issueService.js`
```javascript
import api from "./api";

export const issueService = {
  createIssue: async (issueData) => {
    const response = await api.post("/issues", issueData);
    return response.data;
  },

  getIssues: async (societyId, filters = {}) => {
    const params = new URLSearchParams();
    params.append("societyId", societyId);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/issues/${societyId}?${params}`);
    return response.data;
  },

  getIssueById: async (issueId) => {
    const response = await api.get(`/issues/${issueId}`);
    return response.data;
  },

  getNearbyIssues: async (latitude, longitude, distance = 5000) => {
    const response = await api.get("/issues/nearby", {
      params: { latitude, longitude, distance }
    });
    return response.data;
  },

  addContribution: async (issueId, contributionData) => {
    const response = await api.post(`/issues/${issueId}/contribute`, contributionData);
    return response.data;
  },

  escalateIssue: async (issueId, reason) => {
    const response = await api.post(`/issues/${issueId}/escalate`, { reason });
    return response.data;
  },

  updateStatus: async (issueId, status, notes) => {
    const response = await api.put(`/issues/${issueId}`, {
      status,
      resolutionNotes: notes
    });
    return response.data;
  }
};

export default issueService;
```

### 3. `client/src/services/taskService.js`
```javascript
import api from "./api";

export const taskService = {
  createTask: async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },

  getTasks: async (societyId, filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/tasks/${societyId}?${params}`);
    return response.data;
  },

  getTaskById: async (taskId) => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  getNearbyTasks: async (latitude, longitude, distance = 5000) => {
    const response = await api.get("/tasks/nearby", {
      params: { latitude, longitude, distance }
    });
    return response.data;
  },

  acceptTask: async (taskId) => {
    const response = await api.post(`/tasks/${taskId}/accept`);
    return response.data;
  },

  submitTask: async (taskId, submissionData) => {
    const response = await api.post(`/tasks/${taskId}/submit`, submissionData);
    return response.data;
  },

  getMyTasks: async (page = 1, limit = 10) => {
    const response = await api.get("/tasks/my-assignments", {
      params: { page, limit }
    });
    return response.data;
  }
};

export default taskService;
```

### 4. `client/src/services/notificationService.js`
```javascript
import api from "./api";

export const notificationService = {
  getNotifications: async (page = 1, limit = 10) => {
    const response = await api.get("/notifications", {
      params: { page, limit }
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.post("/notifications/read-all");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread/count");
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

export default notificationService;
```

### 5. `client/src/services/userService.js`
```javascript
import api from "./api";

export const userService = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get("/users/stats");
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get("/users/leaderboard");
    return response.data;
  },

  getContributions: async (page = 1, limit = 10) => {
    const response = await api.get("/users/contributions", {
      params: { page, limit }
    });
    return response.data;
  },

  getBadges: async () => {
    const response = await api.get("/users/badges");
    return response.data;
  }
};

export default userService;
```

### 6. `client/src/services/societyService.js`
```javascript
import api from "./api";

export const societyService = {
  getSocietyDetails: async (societyId) => {
    const response = await api.get(`/societies/${societyId}`);
    return response.data;
  },

  getSocietyMembers: async (societyId, page = 1, limit = 20) => {
    const response = await api.get(`/societies/${societyId}/members`, {
      params: { page, limit }
    });
    return response.data;
  },

  getSocietyStatistics: async (societyId) => {
    const response = await api.get(`/societies/${societyId}/stats`);
    return response.data;
  },

  searchSocieties: async (query, filters = {}) => {
    const params = new URLSearchParams();
    params.append("query", query);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/societies/search?${params}`);
    return response.data;
  },

  getNearby: async (latitude, longitude, distance = 5000) => {
    const response = await api.get("/societies/nearby", {
      params: { latitude, longitude, distance }
    });
    return response.data;
  }
};

export default societyService;
```

---

## Frontend Component Integration Examples

### Example: Issue Creation Component

```javascript
import issueService from "../services/issueService";
import { useUserLocation } from "../hooks/useUserLocation";

export default function CreateIssueForm() {
  const { latitude, longitude, address } = useUserLocation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await issueService.createIssue({
        title,
        description,
        image, // Should be base64 or file path
        latitude,
        longitude,
        address
      });

      if (result.success) {
        toast.success("Issue reported successfully!");
        // Navigate or refresh issues list
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Issue title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Report Issue</button>
    </form>
  );
}
```

### Example: Issues Map Display

```javascript
import issueService from "../services/issueService";
import { useUserLocation } from "../hooks/useUserLocation";

export default function IssuesMap() {
  const [issues, setIssues] = useState([]);
  const { latitude, longitude } = useUserLocation();

  useEffect(() => {
    const loadNearbyIssues = async () => {
      try {
        const result = await issueService.getNearbyIssues(latitude, longitude);
        setIssues(result.issues);
      } catch (error) {
        console.error("Error loading issues:", error);
      }
    };

    loadNearbyIssues();
  }, [latitude, longitude]);

  return (
    <div className="map-container">
      {/* Render issues on map */}
    </div>
  );
}
```

---

## Error Handling Pattern

```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const result = await apiFunction();

    if (result.success) {
      // Handle success
      return result.data;
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";

    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Permission denied
      toast.error("You don't have permission for this action");
    } else if (error.response?.status === 400) {
      // Validation error
      toast.error(errorMessage);
    } else {
      // Server error
      toast.error("Server error. Please try again.");
    }

    throw error;
  }
};
```

---

## Location Services Hook

```javascript
// client/src/hooks/useUserLocation.js
import { useState, useEffect } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: null,
    error: null
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: null,
            error: null
          });
        },
        (error) => {
          setLocation((prev) => ({
            ...prev,
            error: error.message
          }));
        }
      );
    }
  }, []);

  return location;
};
```

---

## API Testing Commands

### Start Backend
```bash
cd server
npm install
npm start
```

### Test with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Test123","role":"volunteer","societyId":"63f..."}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Test123","societyId":"63f..."}'

# Get Profile (with token)
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Frontend Ready Checklist

- [ ] API services created
- [ ] AuthContext updated with service
- [ ] useUserLocation hook created
- [ ] Error handling implemented
- [ ] Loading states in components
- [ ] Token management in localStorage
- [ ] CORS configured on backend
- [ ] Environment variables set
