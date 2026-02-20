import axios from "axios";

// Backend API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }
    return response.data;
  },

  login: async (email, password, societyId) => {
    const response = await apiClient.post("/auth/login", {
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

  verifyToken: async () => {
    const response = await apiClient.post("/auth/verify");
    return response.data;
  }
};

// User API
export const userApi = {
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put("/users/profile", profileData);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get("/users/stats");
    return response.data;
  },

  getContributions: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/users/contributions", {
      params: { page, limit }
    });
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await apiClient.get("/users/leaderboard");
    return response.data;
  },

  getBadges: async () => {
    const response = await apiClient.get("/users/badges");
    return response.data;
  }
};

// Issues API
export const issueApi = {
  getAll: async (societyId, filters = {}) => {
    const response = await apiClient.get(`/issues/${societyId}`, {
      params: filters
    });
    return response.data;
  },

  getById: async (issueId) => {
    const response = await apiClient.get(`/issues/detail/${issueId}`);
    return response.data;
  },

  create: async (issueData) => {
    const response = await apiClient.post("/issues", issueData);
    return response.data;
  },

  getNearby: async (latitude, longitude, distance = 5000) => {
    const response = await apiClient.get("/issues/nearby", {
      params: { latitude, longitude, distance }
    });
    return response.data;
  },

  addContribution: async (issueId, contributionData) => {
    const response = await apiClient.post(`/issues/${issueId}/contribute`, contributionData);
    return response.data;
  },

  updateStatus: async (issueId, status, resolutionNotes) => {
    const response = await apiClient.put(`/issues/${issueId}`, {
      status,
      resolutionNotes
    });
    return response.data;
  },

  escalate: async (issueId, reason) => {
    const response = await apiClient.post(`/issues/${issueId}/escalate`, {
      reason
    });
    return response.data;
  }
};

// Tasks API
export const taskApi = {
  getAll: async (societyId, filters = {}) => {
    const response = await apiClient.get(`/tasks/${societyId}`, {
      params: filters
    });
    return response.data;
  },

  getById: async (taskId) => {
    const response = await apiClient.get(`/tasks/detail/${taskId}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  },

  getNearby: async (latitude, longitude, distance = 5000) => {
    const response = await apiClient.get("/tasks/nearby", {
      params: { latitude, longitude, distance }
    });
    return response.data;
  },

  accept: async (taskId) => {
    const response = await apiClient.post(`/tasks/${taskId}/accept`);
    return response.data;
  },

  submit: async (taskId, submissionData) => {
    const response = await apiClient.post(`/tasks/${taskId}/submit`, submissionData);
    return response.data;
  },

  getMyAssignments: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/tasks/my/assignments", {
      params: { page, limit }
    });
    return response.data;
  }
};

// Society API
export const societyApi = {
  getDetails: async (societyId) => {
    const response = await apiClient.get(`/societies/${societyId}`);
    return response.data;
  },

  getMembers: async (societyId, page = 1, limit = 20) => {
    const response = await apiClient.get(`/societies/${societyId}/members`, {
      params: { page, limit }
    });
    return response.data;
  },

  getStatistics: async (societyId) => {
    const response = await apiClient.get(`/societies/${societyId}/stats`);
    return response.data;
  },

  search: async (query, filters = {}) => {
    const response = await apiClient.get("/societies/search", {
      params: { query, ...filters }
    });
    return response.data;
  },

  getNearby: async (latitude, longitude, distance = 5000) => {
    const response = await apiClient.get("/societies/nearby", {
      params: { latitude, longitude, distance }
    });
    return response.data;
  }
};

// Notifications API
export const notificationApi = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/notifications", {
      params: { page, limit }
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post("/notifications/read-all");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get("/notifications/unread/count");
    return response.data;
  },

  delete: async (notificationId) => {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

// Contributions API
export const contributionApi = {
  create: async (contributionData) => {
    const response = await apiClient.post("/contributions", contributionData);
    return response.data;
  },

  getByIssue: async (issueId, page = 1, limit = 10) => {
    const response = await apiClient.get(`/contributions/issue/${issueId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  verify: async (contributionId, verified, comment) => {
    const response = await apiClient.post(`/contributions/${contributionId}/verify`, {
      verified,
      comment
    });
    return response.data;
  }
};

// Export default api object for backward compatibility
export const api = {
  issues: issueApi,
  tasks: taskApi,
  users: userApi,
  auth: authApi,
  society: societyApi,
  notifications: notificationApi,
  contributions: contributionApi
};

export default apiClient;

