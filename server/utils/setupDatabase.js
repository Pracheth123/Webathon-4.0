module.exports = async function setupDatabase() {
  // Stub used during development so server can call setupDatabase without DB seed logic.
  console.log('setupDatabase: stub - no-op')
}
const mongoose = require("mongoose");
const User = require("../models/User");
const Society = require("../models/Society");
const Issue = require("../models/Issue");
const Contribution = require("../models/Contribution");
const Task = require("../models/Task");
const Analysis = require("../models/Analysis");
const Notification = require("../models/Notification");
const Badge = require("../models/Badge");

const createIndexSafely = async (collection, indexSpec, options = {}) => {
  try {
    await collection.createIndex(indexSpec, options);
  } catch (error) {
    if (error.codeName === 'IndexKeySpecsConflict' || error.code === 86) {
      // Index already exists, skip it
      return;
    }
    throw error;
  }
};

const setupDatabase = async () => {
  try {
    console.log("🔧 Setting up database indexes...\n");

    // User Indexes (skip email - it has unique constraint)
    console.log("📇 Creating User indexes...");
    await createIndexSafely(User.collection, { societyId: 1 });
    await createIndexSafely(User.collection, { role: 1 });
    await createIndexSafely(User.collection, { civicScore: -1 });
    console.log("✅ User indexes created");

    // Society Indexes
    console.log("📇 Creating Society indexes...");
    await createIndexSafely(Society.collection, { "address.city": 1, "address.pinCode": 1 });
    await createIndexSafely(Society.collection, { adminId: 1 });
    await createIndexSafely(Society.collection, { location: "2dsphere" });
    console.log("✅ Society indexes created");

    // Issue Indexes
    console.log("📇 Creating Issue indexes...");
    await createIndexSafely(Issue.collection, { societyId: 1, status: 1 });
    await createIndexSafely(Issue.collection, { "criticality.level": -1 });
    await createIndexSafely(Issue.collection, { location: "2dsphere" });
    await createIndexSafely(Issue.collection, { reportedBy: 1 });
    await createIndexSafely(Issue.collection, { createdAt: -1 });
    await createIndexSafely(Issue.collection, { "aiAnalysis.category": 1 });
    console.log("✅ Issue indexes created");

    // Contribution Indexes
    console.log("📇 Creating Contribution indexes...");
    await createIndexSafely(Contribution.collection, { issueId: 1 });
    await createIndexSafely(Contribution.collection, { contributorId: 1 });
    await createIndexSafely(Contribution.collection, { societyId: 1 });
    await createIndexSafely(Contribution.collection, { verificationStatus: 1 });
    await createIndexSafely(Contribution.collection, { createdAt: -1 });
    console.log("✅ Contribution indexes created");

    // Task Indexes
    console.log("📇 Creating Task indexes...");
    await createIndexSafely(Task.collection, { societyId: 1, status: 1 });
    await createIndexSafely(Task.collection, { location: "2dsphere" });
    await createIndexSafely(Task.collection, { deadline: 1 });
    await createIndexSafely(Task.collection, { type: 1, category: 1 });
    console.log("✅ Task indexes created");

    // Analysis Indexes
    console.log("📇 Creating Analysis indexes...");
    await createIndexSafely(Analysis.collection, { issueId: 1 });
    await createIndexSafely(Analysis.collection, { "severity.level": 1 });
    await createIndexSafely(Analysis.collection, { "category.primary": 1 });
    await createIndexSafely(Analysis.collection, { verified: 1 });
    await createIndexSafely(Analysis.collection, { analyzedAt: -1 });
    console.log("✅ Analysis indexes created");

    // Notification Indexes
    console.log("📇 Creating Notification indexes...");
    await createIndexSafely(Notification.collection, { recipientId: 1, isRead: 1 });
    await createIndexSafely(Notification.collection, { recipientEmail: 1 });
    await createIndexSafely(Notification.collection, { entityType: 1, entityId: 1 });
    await createIndexSafely(Notification.collection, { societyId: 1 });
    await createIndexSafely(Notification.collection, { type: 1 });
    await createIndexSafely(Notification.collection, { createdAt: -1 });
    await createIndexSafely(Notification.collection, { "deliveryStatus.email.sent": 1 });
    console.log("✅ Notification indexes created");

    // Badge Indexes
    console.log("📇 Creating Badge indexes...");
    await createIndexSafely(Badge.collection, { name: 1 });
    await createIndexSafely(Badge.collection, { category: 1 });
    console.log("✅ Badge indexes created");

    console.log("\n✨ Database setup completed successfully!\n");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    throw error;
  }
};

module.exports = setupDatabase;
