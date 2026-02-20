# API Testing Guide with Postman

## Import Collection

### Step 1: Open Postman
- Download from https://www.postman.com/downloads/
- Install and open Postman

### Step 2: Import Collection
1. Click **Import** button (top left)
2. Select **Upload Files**
3. Choose `POSTMAN_COLLECTION.json` from `server/` folder
4. Click **Import**

---

## Environment Setup

### Configure Variables
1. Click the **Environment** dropdown (top right)
2. Select **Edit** next to your environment
3. Set these variables:

| Variable | Value |
|----------|-------|
| `BASE_URL` | `http://localhost:5000/api` |
| `TOKEN` | (Will be set after login) |
| `SOCIETY_ID` | (Will be set after creating society) |
| `ISSUE_ID` | (Will be set after creating issue) |
| `TASK_ID` | (Will be set after creating task) |

---

## Testing Workflow

### 1. Health Check
Test if server is running:

```
GET {{BASE_URL}}/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "Server is running",
  "timestamp": "2024-02-20T...",
  "environment": "development"
}
```

---

### 2. Register User

**Request:**
```
POST {{BASE_URL}}/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test123456",
  "confirmPassword": "Test123456",
  "phone": "9876543210",
  "role": "volunteer",
  "societyId": "WILL_CREATE_BELOW"
}
```

⚠️ **Note:** First create a society and get its ID, or use an existing one

---

### 3. Create Society First (REQUIRED)

**Request:**
```
POST {{BASE_URL}}/societies
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Bandra Society",
  "description": "Residential society in Mumbai",
  "address": "Bandra West",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pinCode": "400050",
  "country": "India",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "municipalContacts": []
}
```

**Save the response `_id` as `SOCIETY_ID`**

---

### 4. Register User (Now with SOCIETY_ID)

Update the register request with the society ID and register a user.

**After successful registration:**
- Copy the `token` from response
- Set `{{TOKEN}}` in environment variables

---

### 5. Login User

**Request:**
```
POST {{BASE_URL}}/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "Test123456",
  "societyId": "{{SOCIETY_ID}}"
}
```

**Save the token for future requests**

---

### 6. Create an Issue

**Request:**
```
POST {{BASE_URL}}/issues
Authorization: Bearer {{TOKEN}}
```

**Body:**
```json
{
  "title": "Broken Streetlight",
  "description": "The streetlight near the park is not working",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "address": "Near Central Park",
  "landmark": "Park Entrance",
  "image": "https://via.placeholder.com/300",
  "tags": ["electricity", "safety"]
}
```

**Save the response `_id` as `ISSUE_ID`**

---

### 7. Get Issue Details

**Request:**
```
GET {{BASE_URL}}/issues/detail/{{ISSUE_ID}}
Authorization: Bearer {{TOKEN}}
```

**Expected:** Issue with all details, contributions, and escalation info

---

### 8. Add Contribution to Issue

**Request:**
```
POST {{BASE_URL}}/issues/{{ISSUE_ID}}/contribute
Authorization: Bearer {{TOKEN}}
```

**Body:**
```json
{
  "description": "I also observed this issue yesterday",
  "image": "https://via.placeholder.com/300"
}
```

**Result:** Issue criticality level increases

---

### 9. Create a Task

**Request:**
```
POST {{BASE_URL}}/tasks
Authorization: Bearer {{TOKEN}}
```

**Body:**
```json
{
  "title": "Document Pothole on Main Street",
  "description": "Please take photos of the pothole near the market corner",
  "type": "image-capture",
  "category": "street-damage",
  "requirements": ["Clear photo", "Daylight"],
  "estimatedTime": 10,
  "difficulty": "easy",
  "latitude": 19.0596,
  "longitude": 72.8295,
  "address": "Main Street Market",
  "pointsReward": 20
}
```

**Save the response `_id` as `TASK_ID`**

---

### 10. Accept Task

**Request:**
```
POST {{BASE_URL}}/tasks/{{TASK_ID}}/accept
Authorization: Bearer {{TOKEN}}
```

**Result:** User is now assigned to the task

---

### 11. Submit Task

**Request:**
```
POST {{BASE_URL}}/tasks/{{TASK_ID}}/submit
Authorization: Bearer {{TOKEN}}
```

**Body:**
```json
{
  "description": "Pothole documented with clear photos",
  "images": ["https://via.placeholder.com/300"],
  "latitude": 19.0596,
  "longitude": 72.8295
}
```

---

### 12. Get Notifications

**Request:**
```
GET {{BASE_URL}}/notifications?page=1&limit=10
Authorization: Bearer {{TOKEN}}
```

**Result:** All notifications for the user

---

### 13. Get User Profile

**Request:**
```
GET {{BASE_URL}}/users/profile
Authorization: Bearer {{TOKEN}}
```

**Result:** User details with updated metrics

---

### 14. Get User Statistics

**Request:**
```
GET {{BASE_URL}}/users/stats
Authorization: Bearer {{TOKEN}}
```

**Result:** Civic score, tasks completed, contributions, etc.

---

## Test Scenarios

### Scenario 1: Basic Workflow
1. ✅ Health Check
2. ✅ Register User
3. ✅ Login
4. ✅ Get Profile
5. ✅ Update Profile

### Scenario 2: Issue Reporting
1. ✅ Create Issue
2. ✅ Get Issue
3. ✅ Add Contributions (from different users)
4. ✅ Issue criticality increases
5. ✅ View Issue Details

### Scenario 3: Task Management
1. ✅ Create Task
2. ✅ Accept Task
3. ✅ Submit Task
4. ✅ Task appears as completed

### Scenario 4: Notifications
1. ✅ Check unread count
2. ✅ Get notifications
3. ✅ Mark as read
4. ✅ Get updated stats

### Scenario 5: Leaderboard
1. ✅ Get leaderboard position
2. ✅ See top contributors
3. ✅ Compare civic scores

---

## Common Errors & Solutions

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Solution:** Make sure `Authorization: Bearer {{TOKEN}}` header is set

---

### 404 Not Found
```json
{
  "success": false,
  "message": "Issue not found"
}
```

**Solution:** Check if `{{ISSUE_ID}}` is set correctly in variables

---

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed"
}
```

**Solution:** Check request body, ensure all required fields are present

---

### 409 Conflict
```json
{
  "success": false,
  "message": "email already exists"
}
```

**Solution:** Use a different email address for registration

---

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Start MongoDB: `mongod`
2. Or use MongoDB Atlas connection string in .env

---

## Advanced Testing

### Test with Different Roles

1. Create users with different roles:
   - `volunteer` - Regular user
   - `community_leader` - Can verify issues
   - `municipal_official` - Can resolve issues

2. Test role-restricted endpoints:
   ```
   POST {{BASE_URL}}/analyses/{{ANALYSIS_ID}}/verify
   (Requires community_leader or municipal_official)
   ```

---

### Test Geospatial Features

Test "nearby" endpoints:

```
GET {{BASE_URL}}/issues/nearby?latitude=19.0596&longitude=72.8295&distance=5000
```

This finds all issues within 5km of the location.

---

### Load Testing

Use Postman's Collection Runner:

1. Click **Collection** → **Run**
2. Set iterations
3. Set delay between requests
4. Click **Run Collection**

View results and performance metrics.

---

## Scripts (Advanced)

Add this to the **Tests** tab of Login request to auto-save token:

```javascript
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("TOKEN", jsonData.token);
  pm.environment.set("SOCIETY_ID", jsonData.user.societyId);
}
```

Add this to Create Issue Tests tab:

```javascript
if (pm.response.code === 201) {
  var jsonData = pm.response.json();
  pm.environment.set("ISSUE_ID", jsonData.issue.id);
}
```

---

## API Response Format

All responses follow this format:

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description",
  "error": "optional error details"
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## Server URLs

- **Local Development:** `http://localhost:5000`
- **API Base:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

---

## Next Steps

After successful testing:

1. ✅ Ensure all endpoints work
2. ✅ Verify data is stored in MongoDB
3. ✅ Test with different user roles
4. ✅ Test geospatial queries
5. ✅ Connect frontend to these APIs
6. ✅ Integrate Gemini API for image analysis
7. ✅ Setup email notifications

---

**Happy Testing! 🚀**
