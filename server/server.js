const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// ==================== MIDDLEWARE ====================
// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parsing
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ==================== DATABASE CONNECTION ====================
const setupDatabase = require("./utils/setupDatabase");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/civic-governance";

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");

    // Setup indexes
    if (process.env.NODE_ENV === "development") {
      await setupDatabase();
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// ==================== ROUTES ====================
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const societyRoutes = require("./routes/society");
const issueRoutes = require("./routes/issue");
const taskRoutes = require("./routes/task");
const analysisRoutes = require("./routes/analysis");
const contributionRoutes = require("./routes/contribution");
const notificationRoutes = require("./routes/notification");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/societies", societyRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analyses", analysisRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/notifications", notificationRoutes);

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Server is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired"
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  🚀 Server running on port ${PORT}        ║`);
      console.log(`║  📍 API: http://localhost:${PORT}/api     ║`);
      console.log(`║  🏥 Health: http://localhost:${PORT}/api/health ║`);
      console.log(`║  🔄 Frontend: ${process.env.CLIENT_URL || "http://localhost:5173"} ║`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

module.exports = app;

