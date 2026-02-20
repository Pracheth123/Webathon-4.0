# MongoDB Setup Guide

## Option 1: MongoDB Local Installation (Recommended for Development)

### Windows Installation

1. **Download MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows, MSI format
   - Download the latest version

2. **Install MongoDB**
   - Run the MSI installer
   - Choose "Complete" installation
   - During setup, ensure "Run as a Service" is checked
   - MongoDB will start automatically

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service** (if not running)
   ```bash
   # Windows Services
   services.msc  # Search and start MongoDB

   # Or via Command Prompt (Admin)
   net start MongoDB
   ```

5. **Connect to MongoDB**
   ```bash
   mongosh
   ```

### macOS Installation

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Check status
brew services list
```

### Linux Installation

```bash
# Ubuntu/Debian
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
```

---

## Option 2: MongoDB Cloud (MongoDB Atlas)

### Create a Free MongoDB Atlas Account

1. **Sign Up**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Click "Start free"
   - Create an account

2. **Create a Cluster**
   - Select "Create Deployment"
   - Choose "Free" tier
   - Select region closest to you
   - Create cluster (takes ~10 minutes)

3. **Setup Network Access**
   - Go to Security → Network Access
   - Add IP Address (or allow all for development: 0.0.0.0/0)
   - Click "Add IP Address"

4. **Create Database User**
   - Go to Security → Database Access
   - Click "Add New Database User"
   - Username: your_username
   - Password: your_password (save this!)
   - Click "Add User"

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Copy the connection string
   - Replace `<password>` with your password
   - Replace `myFirstDatabase` with `civic-governance`

6. **Update .env**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/civic-governance?retryWrites=true&w=majority
   ```

---

## Environment Variable Setup

### For Local MongoDB

```env
# .env file
MONGODB_URI=mongodb://localhost:27017/civic-governance
```

### For MongoDB Atlas

```env
# .env file
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/civic-governance?retryWrites=true&w=majority
```

---

## Verify MongoDB Connection

### Using mongosh (MongoDB Shell)

```bash
# Connect to local MongoDB
mongosh

# Or with connection string
mongosh "mongodb+srv://username:password@cluster.mongodb.net/civic-governance"

# List databases
show databases

# Use your database
use civic-governance

# List collections
show collections

# Check status
db.stats()
```

### Using Node.js

```javascript
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected!"))
  .catch(err => console.error("Connection error:", err));
```

---

## Database Initialization

### Automatic Setup (Run once)

When you start the server in development mode, indexes are created automatically:

```bash
npm run dev
```

You should see:
```
🔧 Setting up database indexes...
📇 Creating User indexes...
✅ User indexes created
... (more for each model)
✨ Database setup completed successfully!
```

---

## Viewing Data in MongoDB

### Using MongoDB Compass (GUI)

1. **Download MongoDB Compass**
   - Visit: https://www.mongodb.com/products/compass
   - Download for your OS

2. **Connect**
   - Paste connection string
   - Click "Connect"
   - Browse collections visually

### Using mongosh Commands

```bash
mongosh

# Switch database
use civic-governance

# View all collections
show collections

# Count documents
db.users.countDocuments()
db.issues.countDocuments()

# Find documents
db.users.find().pretty()
db.issues.find({ status: "open" }).pretty()

# Delete collection
db.users.deleteMany({})  # WARNING: Deletes all users
```

---

## Create Sample Data

### Using mongosh

```javascript
use civic-governance

// Create a society
db.societies.insertOne({
  name: "Sample Society",
  address: {
    street: "123 Main St",
    city: "Mumbai",
    pinCode: "400001",
    country: "India"
  },
  totalMembers: 0,
  createdAt: new Date()
})

// Get the society ID
const society = db.societies.findOne()
const societyId = society._id

// Create a user
db.users.insertOne({
  name: "Test User",
  email: "test@example.com",
  password: "$2a$10$hash", // Should be hashed via bcrypt
  role: "volunteer",
  societyId: societyId,
  civicScore: 0,
  createdAt: new Date()
})
```

---

## Troubleshooting

### MongoDB Won't Start

**Windows:**
```bash
# Check if MongoDB service is installed
sc query MongoDB

# If not, install it
mongod --install

# Start service
net start MongoDB
```

**macOS:**
```bash
# Check status
brew services list mongodb-community

# Restart
brew services restart mongodb-community

# Check logs
log stream --level debug --predicate 'process == "mongod"'
```

### Connection Timeout

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Ensure MongoDB is running: `mongosh`
2. Check connection string in .env
3. For Atlas, whitelist your IP in Network Access
4. Check internet connection (for Atlas)

### Authentication Failed

```
Error: authentication failed
```

**Solutions:**
1. Verify username and password in connection string
2. Check database user exists in Atlas
3. Ensure database user has permission to access the database
4. For Atlas, use "Copy" button for connection string

### Database Not Found

MongoDB automatically creates databases when you insert data. If your database doesn't exist:

```bash
# In mongosh
use civic-governance
db.createCollection("dummy")

# Now use it in application
```

---

## Database Backup

### Local MongoDB

```bash
# Backup
mongodump --db civic-governance --out ./backup

# Restore
mongorestore ./backup
```

### MongoDB Atlas

1. Go to "Backup" in Atlas console
2. Click "Backup Now"
3. Download backup when ready

---

## Performance Tips

1. **Enable Compression** (Atlas)
   - In Atlas settings, enable "Compression"

2. **Index Your Queries**
   - Already done automatically by setupDatabase.js
   - View indexes: `db.collection.getIndexes()`

3. **Set TTL for old notifications**
   ```javascript
   db.notifications.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 })
   ```

4. **Monitor Performance**
   - Atlas: Check "Metrics" tab
   - Local: Use `db.currentOp()` in mongosh

---

## Next Steps

1. Start MongoDB (locally or verify Atlas connection)
2. Run server: `npm run dev`
3. Verify connection in console output
4. Test with Postman (see POSTMAN_COLLECTION.md)

---

**Status:** ✅ Ready to connect and test
