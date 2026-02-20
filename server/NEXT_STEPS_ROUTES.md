# Next Steps: Setting Up Routes & API Endpoints

## Overview
After defining all data models and controllers, the next step is to create route files that map HTTP endpoints to controller methods.

---

## ROUTES TO CREATE

### 1. **Auth Routes** (`server/routes/auth.js`)
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/verify         - Verify JWT token
POST   /api/auth/change-password - Change password
POST   /api/auth/logout         - Logout user
```

### 2. **User Routes** (`server/routes/user.js`)
```
GET    /api/users/profile       - Get current user profile
PUT    /api/users/profile       - Update profile
POST   /api/users/avatar        - Upload avatar
GET    /api/users/stats         - Get user statistics
GET    /api/users/contributions - Get user contributions
GET    /api/users/leaderboard   - Get leaderboard position
GET    /api/users/badges        - Get user badges
GET    /api/users/notifications-prefs - Get notification preferences
PUT    /api/users/notifications-prefs - Update notification preferences
POST   /api/users/deactivate    - Deactivate account
```

### 3. **Society Routes** (`server/routes/society.js`)
```
POST   /api/societies           - Create new society
GET    /api/societies/:id       - Get society details
PUT    /api/societies/:id       - Update society
GET    /api/societies/:id/members - Get society members
GET    /api/societies/:id/stats - Get society statistics
POST   /api/societies/:id/leaders - Add community leader
GET    /api/societies/nearby    - Get nearby societies
GET    /api/societies/search    - Search societies
```

### 4. **Issue Routes** (`server/routes/issue.js`)
```
POST   /api/issues              - Create new issue
GET    /api/issues/:societyId   - Get all issues for society
GET    /api/issues/:id          - Get issue details
POST   /api/issues/:id/contribute - Add contribution
PUT    /api/issues/:id          - Update issue status
POST   /api/issues/:id/escalate - Escalate issue
GET    /api/issues/nearby       - Get nearby issues
```

### 5. **Task Routes** (`server/routes/task.js`)
```
POST   /api/tasks               - Create new task
GET    /api/tasks/:societyId    - Get tasks for society
GET    /api/tasks/:id           - Get task details
POST   /api/tasks/:id/accept    - Accept task
POST   /api/tasks/:id/submit    - Submit task
POST   /api/tasks/:id/verify    - Verify task submission
GET    /api/tasks/nearby        - Get nearby tasks
GET    /api/tasks/my-assignments - Get user's task assignments
```

### 6. **Analysis Routes** (`server/routes/analysis.js`)
```
POST   /api/analyses            - Create analysis (after Gemini)
GET    /api/analyses/issue/:issueId - Get analysis for issue
POST   /api/analyses/:id/verify - Verify analysis
GET    /api/analyses/metrics/:societyId - Get analysis metrics
GET    /api/analyses/unverified - Get unverified analyses
```

### 7. **Contribution Routes** (`server/routes/contribution.js`)
```
POST   /api/contributions       - Create contribution
GET    /api/contributions/issue/:issueId - Get contributions for issue
GET    /api/contributions/user/:userId - Get user contributions
POST   /api/contributions/:id/verify - Verify contribution
POST   /api/contributions/:id/rate - Rate contribution
GET    /api/contributions/pending/:societyId - Get pending contributions
GET    /api/contributions/stats/:societyId - Get stats
```

### 8. **Notification Routes** (`server/routes/notification.js`)
```
GET    /api/notifications       - Get user notifications
POST   /api/notifications/:id/read - Mark as read
POST   /api/notifications/read-all - Mark all as read
POST   /api/notifications/:id/archive - Archive notification
DELETE /api/notifications/:id   - Delete notification
GET    /api/notifications/unread/count - Get unread count
GET    /api/notifications/by-type/:type - Get by type
GET    /api/notifications/stats - Get notification stats
POST   /api/notifications/broadcast - Broadcast (admin)
```

---

## QUICK REQUIREMENTS CHECKLIST

Before creating routes, ensure you have:

### Dependencies Installed
```bash
npm install express express.json bcryptjs jsonwebtoken mongoose dotenv multer cors
```

### Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civic-governance
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NODE_ENV=development
```

### Server.js Structure
```javascript
// Import all dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const societyRoutes = require("./routes/society");
const issueRoutes = require("./routes/issue");
const taskRoutes = require("./routes/task");

// Setup middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/societies", societyRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(process.env.PORT);
```

---

## Key Authentication Pattern

All protected routes should use:
```javascript
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Only authenticated users
router.get("/profile", authMiddleware, userController.getProfile);

// Only leaders and officials
router.post("/verify",
  authMiddleware,
  authorize("community_leader", "municipal_official"),
  controller.verify
);
```

---

## Response Format Consistency

All endpoints should follow:
```javascript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error
{
  "success": false,
  "message": "Error description",
  "error": "..." // optional
}

// Paginated
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Testing Your API

Use Postman or Insomnia:

1. **Register User**
   - POST: `http://localhost:5000/api/auth/register`
   - Body: `{ "name": "...", "email": "...", "password": "...", "societyId": "..." }`

2. **Login**
   - POST: `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "...", "password": "...", "societyId": "..." }`
   - Save the token from response

3. **Get Profile** (with token)
   - GET: `http://localhost:5000/api/users/profile`
   - Header: `Authorization: Bearer <token>`

4. **Create Issue**
   - POST: `http://localhost:5000/api/issues`
   - Headers: Authorization, Content-Type: application/json
   - Body with image, location, society ID

---

## What You Have Now

✅ 8 Data Models with proper relationships
✅ 8 Controllers with all business logic
✅ 2 Middleware files for security
✅ 4 Utility files for validation & error handling
✅ Complete documentation

### What's Needed Next

⏳ 8 Route files connecting controllers to endpoints
⏳ Updated server.js with all middleware & routes
⏳ MongoDB setup & connection
⏳ API testing with Postman
⏳ Frontend API services integration
⏳ Gemini API integration for image analysis
⏳ Google Maps API for location services
⏳ Email service for municipal notifications

---

**Recommendation:** Would you like me to create all the route files next, or would you prefer to create them yourself? I can also set up the complete server.js file with all routes and middleware configured.
