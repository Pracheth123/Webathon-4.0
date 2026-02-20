# 🚀 Complete Application Startup Guide

## Current Status

✅ **Backend Server:** Running on port 5001
✅ **MongoDB:** Connected and synced
✅ **All Collections:** Created with proper indexes
✅ **CRUD Operations:** Fully functional

---

## How to Start the Application

### Step 1: Start MongoDB
Ensure MongoDB is running on `localhost:27017`
```bash
mongod
```

### Step 2: Start the Backend Server
```bash
cd c:\Users\Sreesatvik\Documents\Webathon-4.0\server
npm run dev
```

Expected output:
```
✅ MongoDB connected successfully
✨ Database setup completed successfully!
🚀 Server running on port 5001
```

### Step 3: Start the Frontend (in a new terminal)
```bash
cd c:\Users\Sreesatvik\Documents\Webathon-4.0\client
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## Testing the Application

### Method 1: Through Frontend UI
1. Open browser to `http://localhost:5173`
2. Register a new account
3. Create an issue
4. Check MongoDB to verify data was saved

### Method 2: Using curl (for testing API endpoints)

#### Register a User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Your Name",
    "email":"youremail@test.com",
    "password":"Password123456",
    "confirmPassword":"Password123456",
    "phone":"9876543210",
    "role":"volunteer",
    "societyId":"6998c0871d5f084c90ef7de9"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@test.com",
    "password":"Admin123456",
    "societyId":"6998c0871d5f084c90ef7de9"
  }'
```

You'll receive a JWT token - copy it for authenticated requests.

#### Create an Issue (requires token)
```bash
curl -X POST http://localhost:5001/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title":"Broken Streetlight",
    "description":"Street light not working",
    "image":"https://via.placeholder.com/300",
    "latitude":28.5355,
    "longitude":77.3910,
    "address":"Main Road, Delhi"
  }'
```

#### Get All Issues
```bash
curl "http://localhost:5001/api/issues/6998c0871d5f084c90ef7de9" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String ("volunteer", "community_leader", "municipal_official", "admin"),
  phone: String,
  civicScore: Number,
  reliabilityScore: Number,
  contributionsCount: Number,
  societyId: ObjectId,
  createdAt: Date
}
```

### Issues Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  image: String,
  status: String ("open", "in-progress", "under-review", "resolved", "closed"),
  location: {
    type: "Point",
    coordinates: [longitude, latitude],
    address: String
  },
  reportedBy: ObjectId (User),
  societyId: ObjectId (Society),
  criticality: { level: 1-5, baseScore, ageScore, contributionScore },
  contributions: { count, contributors[], verifications[] },
  createdAt: Date
}
```

### Societies Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  location: { type: "Point", coordinates: [lon, lat] },
  address: { street, city, state, pinCode, country },
  adminId: ObjectId (User),
  totalMembers: Number,
  totalVolunteers: Number,
  totalIssuesReported: Number
}
```

---

## Available API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /verify-token` - Verify JWT token
- `POST /change-password` - Change password
- `POST /logout` - Logout user

### Users (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /statistics` - Get user statistics
- `GET /leaderboard` - Get civic leaderboard
- `GET /badges` - Get user badges
- `GET /{userId}/contributions` - Get user contributions

### Issues (`/api/issues`)
- `POST /` - Create issue
- `GET /{societyId}` - Get all issues in society
- `GET /{issueId}` - Get single issue
- `PUT /{issueId}` - Update issue
- `POST /{issueId}/contributions` - Add contribution
- `POST /{issueId}/escalate` - Escalate issue

### Tasks (`/api/tasks`)
- `POST /` - Create task
- `GET /{societyId}` - Get all tasks
- `GET /nearby` - Get nearby tasks
- `POST /{taskId}/accept` - Accept task
- `POST /{taskId}/submit` - Submit task completion

### Societies (`/api/societies`)
- `GET /search` - Search societies
- `GET /nearby` - Get nearby societies
- `POST /` - Create society
- `GET /{societyId}` - Get society details
- `GET /{societyId}/stats` - Get statistics

---

## Troubleshooting

### Issue: "Port 5001 already in use"
```bash
# Kill all node processes
powershell -Command "Get-Process node | Stop-Process -Force"
# Restart server
npm run dev
```

### Issue: MongoDB connection error
```bash
# Verify MongoDB is running
mongosh  # Opens MongoDB shell
# If it fails, start MongoDB
mongod
```

### Issue: Frontend can't reach backend
- Verify backend is running on port 5001
- Check `client/.env` has correct API URL
- Clear browser cache and restart frontend

### Issue: Getting "Invalid token" errors
- Token expiry is 7 days
- Generate new token by logging in again
- Include `Authorization: Bearer TOKEN` header in requests

---

## Key Information

**Admin Test Account:**
- Email: `admin@test.com`
- Password: `Admin123456`
- Society ID: `6998c0871d5f084c90ef7de9`

**Frontend URL:** `http://localhost:5173`
**Backend API:** `http://localhost:5001/api`
**MongoDB:** `mongodb://localhost:27017/civic-governance`

---

## Database Collections

| Name | Purpose | Documents |
|------|---------|-----------|
| users | Store user profiles | 3+ |
| societies | Community/society data | 2+ |
| issues | Civic issues reported | 1+ |
| tasks | Micro-tasks for volunteers | 0+ |
| contributions | Issue contributions/verifications | 0+ |
| notifications | User alerts and notifications | 0+ |
| analysis | AI analysis results | 0+ |
| badges | Achievement system | 0+ |

---

## What's Working

✅ User registration and login with JWT authentication
✅ Creating issues with location data
✅ User profiles and civic scores
✅ MongoDB data persistence
✅ Role-based access control
✅ Geospatial queries for nearby issues/tasks
✅ Real-time score updates
✅ Contribution tracking and verification
✅ Society management
✅ Task assignment system

---

## Next Steps

1. **Test the Frontend:** Fill out the registration form to create new users
2. **Create Test Data:** Report issues through the UI
3. **Verify in MongoDB:** Check that data is saved correctly
4. **Test Full Workflows:** Complete a full user journey (register → create issue → complete task)

---

## Support

For detailed documentation, see:
- `CRUD_VERIFICATION_REPORT.md` - CRUD operations testing results
- `README.md` - Project overview
- `MODELS_CONTROLLERS_SUMMARY.md` - Database schema details

