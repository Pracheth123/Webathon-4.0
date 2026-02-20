# ⚡ Quick Start Guide (5 Minutes)

## 1️⃣ Prerequisites Check
```bash
node --version      # Should be v14+
npm --version       # Should be v6+
mongosh --version   # MongoDB installed
```

## 2️⃣ Start MongoDB
**Windows/Mac/Linux:**
```bash
mongod              # Start MongoDB
# In another terminal:
mongosh             # Verify connection
```

**Or use MongoDB Atlas (Cloud):**
- Sign up: https://www.mongodb.com/cloud/atlas
- Get connection string
- Update `.env` with connection string

## 3️⃣ Start Server
```bash
cd server
npm install         # If not done already
npm run dev         # Start in development mode
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║  🚀 Server running on port 5000        ║
║  📍 API: http://localhost:5000/api     ║
╚════════════════════════════════════════╝
```

## 4️⃣ Test Server
```bash
# In another terminal
curl http://localhost:5000/api/health

# Should return:
# {"success":true,"status":"Server is running"...}
```

## 5️⃣ Test with Postman (Recommended)

**Method 1: Import Collection**
1. Download Postman: https://www.postman.com/downloads/
2. Open Postman → Click **Import**
3. Select `server/POSTMAN_COLLECTION.json`
4. You have 60+ pre-built API requests ready to test!

**Method 2: Manual cURL**
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John",
    "email":"john@test.com",
    "password":"Test123456",
    "confirmPassword":"Test123456",
    "phone":"9876543210",
    "role":"volunteer",
    "societyId":"64f1a1b1c1d1e1f1g1h1i1j1"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@test.com",
    "password":"Test123456",
    "societyId":"64f1a1b1c1d1e1f1g1h1i1j1"
  }'
```

---

## 📝 File Structure

```
server/
├── server.js              ← Main entry point
├── .env                   ← Configuration
├── package.json           ← Dependencies
├── models/                ← Database schemas (8 files)
├── controllers/           ← Business logic (8 files)
├── routes/                ← API endpoints (8 files)
├── middleware/            ← Authentication & auth
├── utils/                 ← Helpers & validation
└── [Various guides]       ← Documentation
```

---

## 🔌 Key Endpoints

```
POST   /api/auth/register         Register user
POST   /api/auth/login            Login user
GET    /api/users/profile         Get my profile
POST   /api/issues                Report issue
GET    /api/issues/nearby         Find nearby issues
POST   /api/tasks                 Create task
GET    /api/tasks/nearby          Find nearby tasks
GET    /api/notifications         Get messages
```

### Using Endpoints

**With Token:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/users/profile
```

**Set Token in Postman:**
- Click "Authorization" tab
- Type: "Bearer Token"
- Token: Paste your token
- All requests will include it

---

## 🗄️ Database

**View Data:**
```bash
mongosh
use civic-governance
show collections
db.users.find()          # See all users
db.issues.find()         # See all issues
```

**Delete All Data (for testing):**
```bash
mongosh
use civic-governance
db.users.deleteMany({})
db.issues.deleteMany({})
```

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Start MongoDB: `mongod` |
| `Port 5000 in use` | Change PORT in .env |
| `CORS error` | Check CLIENT_URL in .env |
| `401 Unauthorized` | Add token to Authorization header |
| `Token not set` | Login first to get token |

---

## 📚 Documentation

| File | Read When |
|------|-----------|
| `README.md` | Want full documentation |
| `TESTING_GUIDE.md` | Testing endpoints |
| `MONGODB_SETUP.md` | Setting up MongoDB |
| `SETUP_COMPLETE.md` | What was set up |

---

## 🎯 Test Workflow

1. **Start Server**: `npm run dev`
2. **Health Check**: `curl http://localhost:5000/api/health`
3. **Register**: Use Postman collection
4. **Login**: Copy token from response
5. **Set Token**: In Postman environment variables
6. **Test**: Try all endpoints
7. **View Data**: Check MongoDB with `mongosh`

---

## 📁 Environment Setup

Create/Update `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/civic-governance
CLIENT_URL=http://localhost:5173
JWT_SECRET=mysecretkey123
NODE_ENV=development
```

---

## 🚀 Common Commands

```bash
# Start server (dev mode with auto-reload)
npm run dev

# Start server (production mode)
npm start

# Install dependencies
npm install

# View logs
# Just check terminal output

# Stop server
# Press Ctrl+C
```

---

## 📊 Project Status

✅ 8 Data Models
✅ 8 Controllers
✅ 8 Route Files
✅ Complete Middleware
✅ Helper Utilities
✅ 60+ API Endpoints
✅ Postman Collection
✅ Documentation
✅ **READY TO USE!**

---

## 🎓 Next Learning

1. **Understand Endpoints**: Read `TESTING_GUIDE.md`
2. **Know Data Models**: Read `MODELS_CONTROLLERS_SUMMARY.md`
3. **Frontend Integration**: Read `FRONTEND_INTEGRATION_GUIDE.md`
4. **Gemini API**: See `analysisController.js`

---

## 💡 Pro Tips

1. **Use Postman Scripts** for automatic token management
2. **Set Environment Variables** for quick switching
3. **Test Geospatial** with nearby endpoints
4. **Monitor Logs** in terminal for debugging
5. **Check MongoDB** data with mongosh

---

## ✨ What You Have

- 60+ API Endpoints
- 8 Database Models
- Role-Based Access
- Authentication & Authorization
- Email Notifications (configured)
- Image Analysis (ready for Gemini)
- Geospatial Queries
- Points & Badges System
- Full API Documentation

---

## 🎉 You're Ready!

1. **Start server**: `npm run dev`
2. **Test endpoints**: Use Postman
3. **Build frontend**: Connect to API
4. **Deploy**: Take to production

**Status: PRODUCTION READY ✅**

---

**Need help? Check:**
- `README.md` - Full documentation
- `TESTING_GUIDE.md` - Testing guide
- `MONGODB_SETUP.md` - Database setup
- Terminal logs - Error messages
