// User Roles
const ROLES = {
  VOLUNTEER: "volunteer",
  COMMUNITY_LEADER: "community_leader",
  MUNICIPAL_OFFICIAL: "municipal_official",
  ADMIN: "admin"
};

// Issue Status
const ISSUE_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  UNDER_REVIEW: "under-review",
  RESOLVED: "resolved",
  CLOSED: "closed"
};

// Issue Criticality Levels
const CRITICALITY_LEVELS = {
  LOW: 1,
  MEDIUM_LOW: 2,
  MEDIUM: 3,
  MEDIUM_HIGH: 4,
  CRITICAL: 5
};

// Task Status
const TASK_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  EXPIRED: "expired",
  CANCELLED: "cancelled"
};

// Task Types
const TASK_TYPES = {
  IMAGE_CAPTURE: "image-capture",
  TRANSLATION: "translation",
  VERIFICATION: "verification",
  FACILITY_CHECK: "facility-check",
  DATA_COLLECTION: "data-collection",
  SURVEY: "survey",
  CLEANUP: "cleanup",
  OTHER: "other"
};

// Category
const CATEGORIES = {
  INFRASTRUCTURE: "infrastructure",
  SANITATION: "sanitation",
  STREET_DAMAGE: "street-damage",
  WATER_SUPPLY: "water-supply",
  ELECTRICITY: "electricity",
  PUBLIC_NOTICE: "public-notice",
  VEGETATION: "vegetation",
  WASTE_MANAGEMENT: "waste-management",
  OTHER: "other"
};

// Contribution Types
const CONTRIBUTION_TYPES = {
  VERIFICATION: "verification",
  ADDITIONAL_EVIDENCE: "additional-evidence",
  DESCRIPTION: "description",
  COMMENT: "comment"
};

// Verification Status
const VERIFICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected"
};

// Severity Levels
const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
};

// Notification Types
const NOTIFICATION_TYPES = {
  ISSUE_CREATED: "issue_created",
  ISSUE_UPDATED: "issue_updated",
  ISSUE_RESOLVED: "issue_resolved",
  CONTRIBUTION_ADDED: "contribution_added",
  TASK_ASSIGNED: "task_assigned",
  TASK_COMPLETED: "task_completed",
  ESCALATION_ALERT: "escalation_alert",
  MUNICIPAL_NOTIFICATION: "municipal_notification",
  VERIFICATION_REQUEST: "verification_request",
  ACHIEVEMENT_UNLOCKED: "achievement_unlocked",
  SYSTEM_ALERT: "system_alert"
};

// Difficulty Levels
const DIFFICULTY_LEVELS = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard"
};

// Priority Levels
const PRIORITY_LEVELS = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent"
};

// Points System
const POINTS = {
  ISSUE_REPORTED: 10,
  CONTRIBUTION: 5,
  CONTRIBUTION_VERIFIED: 10,
  TASK_COMPLETED: 15,
  TASK_SELF_RESOLVED: 50,
  COMMUNITY_LEADER_RESOLUTION: 30,
  MUNICIPAL_OFFICIAL_RESOLUTION: 50
};

// Geospatial Constants
const GEO_CONSTANTS = {
  DEFAULT_DISTANCE: 5000, // meters
  DEFAULT_RADIUS: 500, // meters
  EARTH_RADIUS_METERS: 6371000
};

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  NO_TOKEN: "No authentication token provided",
  INVALID_TOKEN: "Invalid or expired token",
  USER_NOT_FOUND: "User not found",
  ISSUE_NOT_FOUND: "Issue not found",
  TASK_NOT_FOUND: "Task not found",
  SOCIETY_NOT_FOUND: "Society not found",
  DUPLICATE_EMAIL: "Email already exists",
  INVALID_CREDENTIALS: "Invalid email or password",
  VALIDATION_ERROR: "Validation failed",
  INTERNAL_ERROR: "Internal server error"
};

// Success Messages
const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  REGISTRATION_SUCCESS: "Registration successful",
  PROFILE_UPDATED: "Profile updated successfully",
  ISSUE_CREATED: "Issue created successfully",
  ISSUE_UPDATED: "Issue updated successfully",
  CONTRIBUTION_ADDED: "Contribution added successfully",
  TASK_CREATED: "Task created successfully",
  TASK_COMPLETED: "Task completed successfully"
};

module.exports = {
  ROLES,
  ISSUE_STATUS,
  CRITICALITY_LEVELS,
  TASK_STATUS,
  TASK_TYPES,
  CATEGORIES,
  CONTRIBUTION_TYPES,
  VERIFICATION_STATUS,
  SEVERITY_LEVELS,
  NOTIFICATION_TYPES,
  DIFFICULTY_LEVELS,
  PRIORITY_LEVELS,
  POINTS,
  GEO_CONSTANTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
