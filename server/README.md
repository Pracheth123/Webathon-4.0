# Community Micro-Task Platform - Backend API

A comprehensive backend system for a community-driven civic engagement platform that enables micro-volunteering through task-based contributions.

## 🌟 Features

### Core Features
- **User Management**: Multi-role authentication (Volunteer, Community Leader, Municipal Official, Admin)
- **Issue Tracking**: Report and track civic issues with geospatial capabilities
- **Micro-Tasks**: Create and assign small, context-specific tasks
- **Contribution System**: Verify and track community contributions
- **Criticality Calculation**: Dynamic issue prioritization based on age and verification count
- **Notifications**: Real-time alerts for all system events
- **Leaderboard**: Community engagement rankings and rewards

### Advanced Features
- ✅ Geospatial queries (find nearby issues/tasks/societies)
- ✅ AI-powered image analysis integration (ready for Gemini API)
- ✅ Role-based access control (RBAC)
- ✅ JWT authentication with token validation
- ✅ Points & badges system
- ✅ Escalation workflows to municipal authorities
- ✅ Email notifications (configured for nodemailer)

---

## 📁 Project Structure

```
server/
├── models/                    # Database schemas
│   ├── User.js
│   ├── Society.js
│   ├── Issue.js
│   ├── Contribution.js
│   ├── Task.js
│   ├── Analysis.js
│   ├── Notification.js
│   └── Badge.js
├── controllers/              # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── societyController.js
│   ├── issueController.js
│   ├── taskController.js
│   ├── analysisController.js
│   ├── contributionController.js
│   └── notificationController.js
├── routes/                   # API endpoints
│   ├── auth.js
│   ├── user.js
│   ├── society.js
│   ├── issue.js
│   ├── task.js
│   ├── analysis.js
│   ├── contribution.js
│   └── notification.js
├── middleware/               # Custom middleware
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── utils/                    # Helper functions
│   ├── validators.js
│   ├── responseFormatter.js
│   ├── errorHandler.js
│   ├── constants.js
│   └── setupDatabase.js
├── .env                      # Environment variables
├── package.json
├── server.js                 # Main server file
└── [Documentation files]
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup MongoDB**
   - See `MONGODB_SETUP.md` for detailed instructions
   - Options: Local installation or MongoDB Atlas (cloud)

4. **Start Server**
   ```bash
   npm run dev          # Development with auto-reload
   npm start            # Production mode
   ```

   Server runs on: `http://localhost:5000`

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register           Register new user
POST   /api/auth/login              Login user
POST   /api/auth/verify             Verify JWT token
POST   /api/auth/change-password    Change password
POST   /api/auth/logout             Logout user
```

### Users
```
GET    /api/users/profile           Get user profile
PUT    /api/users/profile           Update profile
GET    /api/users/stats             Get user statistics
GET    /api/users/contributions     Get user contributions
GET    /api/users/leaderboard       Get leaderboard position
GET    /api/users/badges            Get user badges
```

### Society
```
POST   /api/societies               Create society
GET    /api/societies/:id           Get society details
PUT    /api/societies/:id           Update society
GET    /api/societies/:id/members   Get members
GET    /api/societies/:id/stats     Get statistics
GET    /api/societies/nearby        Find nearby societies
GET    /api/societies/search        Search societies
```

### Issues
```
POST   /api/issues                  Create issue
GET    /api/issues/:societyId       Get all issues
GET    /api/issues/detail/:id       Get issue details
GET    /api/issues/nearby           Find nearby issues
POST   /api/issues/:id/contribute   Add contribution
PUT    /api/issues/:id              Update status
POST   /api/issues/:id/escalate     Escalate to authorities
```

### Tasks
```
POST   /api/tasks                   Create task
GET    /api/tasks/:societyId        Get all tasks
GET    /api/tasks/detail/:id        Get task details
GET    /api/tasks/nearby            Find nearby tasks
POST   /api/tasks/:id/accept        Accept task
POST   /api/tasks/:id/submit        Submit completed task
POST   /api/tasks/:id/verify        Verify submission
```

### Notifications
```
GET    /api/notifications           Get all notifications
POST   /api/notifications/:id/read  Mark as read
POST   /api/notifications/read-all  Mark all as read
GET    /api/notifications/unread/count  Get unread count
```

---

## 📋 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/civic-governance

# Frontend
CLIENT_URL=http://localhost:5173

# Authentication
JWT_SECRET=your_secure_secret_key

# APIs
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

## 🧪 Testing

### Using Postman

1. **Import Collection**
   - Open Postman
   - Click Import
   - Select `POSTMAN_COLLECTION.json`

2. **Configure Environment**
   - Set `BASE_URL` = `http://localhost:5000/api`
   - Login to get `TOKEN`

3. **Start Testing**
   - Follow the testing workflow in `TESTING_GUIDE.md`

### Using cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Test123","role":"volunteer","societyId":"..."}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123","societyId":"..."}'
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `MODELS_CONTROLLERS_SUMMARY.md` | Complete data model & controller reference |
| `NEXT_STEPS_ROUTES.md` | Route mapping and next steps |
| `MONGODB_SETUP.md` | MongoDB installation & configuration |
| `TESTING_GUIDE.md` | Comprehensive API testing guide |
| `POSTMAN_COLLECTION.json` | Pre-built Postman collection |

---

## 🔐 Authentication

### JWT Token Flow

1. **Register/Login**
   - User provides credentials
   - Server validates and generates JWT token
   - Token contains: `userId`, `email`, `role`, `societyId`

2. **Protected Routes**
   - Add header: `Authorization: Bearer {{TOKEN}}`
   - Middleware validates token
   - Request proceeds if valid

3. **Token Expiry**
   - Default: 7 days
   - Refresh by logging in again

### Role-Based Access

```
Volunteer              Community Leader       Municipal Official
├─ Report issues       ├─ Verify issues       ├─ Resolve issues
├─ Accept tasks        ├─ Create tasks        ├─ Access reports
├─ Contribute          ├─ Approve contrib.    ├─ Escalation mgmt
└─ View leaderboard    └─ View analytics      └─ Broadcast msgs
```

---

## 💾 Database

### Collections
- **users** - User accounts and profiles
- **societies** - Community definitions
- **issues** - Civic problems reported
- **contributions** - Verifications & evidence
- **tasks** - Micro-task assignments
- **analyses** - AI analysis results
- **notifications** - User alerts
- **badges** - Achievement definitions

### Indexes
- Automatically created on server startup (dev mode)
- Optimized for common queries
- Geospatial indexes for location queries

---

## 🎯 Criticality Calculation

Issues are prioritized based on:

1. **Base Score** (AI Analysis Severity)
   - Low: 10 points
   - Medium: 20 points
   - High: 30 points
   - Critical: 40 points

2. **Age Score** (Time-based escalation)
   - 0 days: 0 points
   - 30 days: 60 points
   - Encourages faster resolution

3. **Contribution Score** (Community verification)
   - Each additional contributor: +10 points
   - Max: 50 points
   - Higher verification = higher priority

**Level Assignment:**
- Level 1 (Low): Score < 20
- Level 2: Score 20-40
- Level 3 (Medium): Score 40-60
- Level 4: Score 60-80
- Level 5 (Critical): Score > 80

---

## 🏆 Points System

| Action | Points |
|--------|--------|
| Report Issue | 10 |
| Add Contribution | 5 |
| Verified Contribution | 10 |
| Complete Task | 15 |
| Community Leader Resolution | 30 |
| Municipal Official Resolution | 50 |

---

## 🚨 Error Handling

All errors follow standard format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (optional)"
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation)
- `401` - Unauthorized (auth)
- `403` - Forbidden (permission)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

---

## 🔌 Integration Points

### Ready for Integration
- ✅ **Gemini API** - Image analysis (hook in analysisController.js)
- ✅ **Google Maps API** - Location services
- ✅ **Node Mailer** - Email notifications
- ✅ **Firebase** - Push notifications (can be added)

### Frontend Integration
- API Base: `http://localhost:5000/api`
- See `FRONTEND_INTEGRATION_GUIDE.md` in root directory

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# For Atlas, verify IP whitelist and credentials
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
- Check `CLIENT_URL` in .env
- Ensure frontend URL matches

### Token Expired
```json
{
  "success": false,
  "message": "Token expired"
}
```
- Login again to get new token

---

## 📊 Performance

### Optimizations
- Database indexes for fast queries
- Geospatial indexes for location queries
- Connection pooling (Mongoose)
- Compression middleware
- Request size limits

### Monitoring
- Morgan HTTP logger (dev mode)
- Error logging with stack traces
- Database operation logging

---

## 🛡️ Security

### Implemented
- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ CORS configuration
- ✅ Request size limits
- ✅ Input validation
- ✅ Error handling (no stack traces in prod)

### Not Yet (For Enhancement)
- ⏳ Rate limiting
- ⏳ Helmet.js security headers
- ⏳ Input sanitization (XSS prevention)
- ⏳ SQL injection prevention (using Mongoose ORM)

---

## 📈 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

### Cloud Deployment (e.g., Vercel, Railway, Heroku)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

---

## 📞 Support & Contributing

For issues or questions:
1. Check `TESTING_GUIDE.md`
2. Review `MONGODB_SETUP.md`
3. Check server logs for errors

---

## 📄 License

ISC License

---

## 🎉 Ready to Launch!

Your backend is now complete with:
- ✅ 8 Data Models
- ✅ 8 Controllers
- ✅ 8 Route Files
- ✅ Complete Middleware
- ✅ Helper Utilities
- ✅ Comprehensive Documentation
- ✅ Postman Collection
- ✅ Testing Guide

**Next Steps:**
1. Start MongoDB
2. Run server: `npm run dev`
3. Test endpoints with Postman
4. Connect frontend to API
5. Integrate Gemini API for image analysis

---

**Last Updated:** 2026-02-20
**Version:** 1.0.0
**Status:** Production Ready ✅
