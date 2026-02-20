# Community Micro-Task Platform - Backend Data Models & Controllers Summary

## Overview
This document summarizes all the data models and controllers created for the Community Micro-Task Platform backend.

---

## DATA MODELS CREATED (8 Models)

### 1. **User Model** (`server/models/User.js`)
Stores information about all users in the platform.

**Key Fields:**
- Basic Info: name, email, password, phone, avatar
- Role: volunteer, community_leader, municipal_official, admin
- Society: societyId reference
- Profile: bio, location (geospatial), address, city, pinCode
- Civic Score & Reputation: civicScore, reliabilityScore, contributionsCount, tasksCompleted
- Badges & Achievements: badges array
- Notification Preferences: emailNotifications, pushNotifications
- Account Status: isActive, isVerified
- Timestamps: createdAt, updatedAt

---

### 2. **Society Model** (`server/models/Society.js`)
Represents a neighborhood/community/society.

**Key Fields:**
- Basic Info: name, description, image
- Location: complete address with geospatial coordinates
- Administration: adminId, communityLeaders array, municipalContacts
- Statistics: totalMembers, totalVolunteers, totalIssuesReported, totalIssuesResolved, resolutionRate
- Settings: allowPublicContributions, criticityAutoCalculation, requireVerification, autoEmailOnEscalation
- Tracking: lastActivityAt

---

### 3. **Issue Model** (`server/models/Issue.js`)
Main model for civic issues/problems reported by users.

**Key Fields:**
- Basic Info: title, description, generatedDescription, tags
- Image & Evidence: image, beforeImage, afterImage, multipleImages
- Location: geospatial coordinates, address, landmark
- Society & Reporter: societyId, reportedBy
- Status: open, in-progress, under-review, resolved, closed
- **Criticality System:**
  - level (1-5)
  - baseScore (AI analysis)
  - ageScore (older issues get higher priority)
  - contributionScore (based on verification count)
- **AI Analysis Results:**
  - isAnalyzed, severity, category, confidence, analyzedAt
- **Contributions & Verifications:**
  - count, contributors array, verifications array
- **Resolution Info:**
  - resolvedBy (volunteer/municipal/leader), resolvedById, resolvedAt, resolutionNotes, proofImage
- **Escalation:**
  - isEscalated, escalatedAt, escalationReason, sentToMunicipal

---

### 4. **Contribution Model** (`server/models/Contribution.js`)
Tracks individual contributions to issues by users.

**Key Fields:**
- References: issueId, contributorId, societyId
- Type: verification, additional-evidence, description, comment
- Content: image, description, comment, evidence
- Engagement: upvotes, downvotes, helpfulCount
- Verification: verificationStatus, verifiedBy, verificationComment, verifiedAt
- Quality: qualityScore (0-100)
- Rewards: pointsEarned, badgeEarned
- Metadata: isDeleted

---

### 5. **Task Model** (`server/models/Task.js`)
Micro-tasks that volunteers can complete.

**Key Fields:**
- Basic Info: title, description, type, category
- Details: requirements array, estimatedTime, difficulty
- Location: geospatial coordinates with radius
- Society & Assignment: societyId, assignedBy, relatedIssueId
- Status: open, in-progress, completed, expired, cancelled
- **Assignments & Submissions:**
  - Array of assignments with userId, status, submittedAt, submissionData
  - submissionData: images, description, location
- **Rewards:** points, badgeId, incentive
- Timeline: deadline, priority
- Statistics: totalAssignments, completedAssignments, completionRate

---

### 6. **Analysis Model** (`server/models/Analysis.js`)
Stores AI analysis results for images.

**Key Fields:**
- Image Analysis: imageUrl
- **AI Generated Content:**
  - generatedDescription
  - generatedTags
- **Severity Detection:**
  - level (low/medium/high/critical)
  - confidence (0-100)
  - reasoning
- **Category Detection:**
  - primary & secondary categories
  - confidence score
- **Structural Analysis:**
  - detectedElements array (element, location, severity, confidence)
- **Safety Hazards:**
  - identified (boolean)
  - hazards array with name, level, description
- **Recommended Actions:**
  - Array of actions with priority & estimatedResolutionTime
- **API Info:** provider (Gemini/OpenAI/local), model, version
- **Quality & Verification:**
  - qualityScore, verified, verifiedBy, verificationNotes, verifiedAt
- **Manual Corrections:**
  - Applied corrections with field, original/corrected values, reason

---

### 7. **Notification Model** (`server/models/Notification.js`)
Stores notifications for users.

**Key Fields:**
- Recipient: recipientId, recipientEmail, recipientRole
- Entity Reference: entityType, entityId
- Society: societyId
- **Notification Type:**
  - issue_created, issue_updated, issue_resolved
  - contribution_added, task_assigned, task_completed
  - escalation_alert, municipal_notification
  - verification_request, achievement_unlocked, system_alert
- Content: subject, message, htmlContent
- Action Info: actionUrl, actionButtonText
- Related Data: issueName, taskName, userNames, criticality
- **Delivery Status:**
  - email: sent, sentAt, openedAt, error
  - push: sent, sentAt, deliveredAt, error
- User Interaction: isRead, readAt, isArchived
- Priority: low/normal/high/urgent
- Expiry: expiresAt, isExpired

---

### 8. **Badge Model** (`server/models/Badge.js`)
Achievement badges for users.

**Key Fields:**
- Basic Info: name, description, icon, color
- **Criteria:**
  - type (contribution_count, verification_count, task_completion, reliability_score, etc.)
  - threshold
  - description
- Category: engagement, reliability, expertise, leadership, special
- Rarity: common, uncommon, rare, epic, legendary
- Status: isActive

---

## CONTROLLERS CREATED (8 Controllers)

### 1. **Auth Controller** (`server/controllers/authController.js`)
Handles user authentication and authorization.

**Methods:**
- `register()` - Register new user with validation
- `login()` - User login with JWT token generation
- `verifyToken()` - Verify token validity
- `changePassword()` - Change user password
- `logout()` - Logout user

**Features:**
- Password hashing with bcrypt
- JWT token generation & verification
- Automatic society member count update

---

### 2. **User Controller** (`server/controllers/userController.js`)
Manages user profiles and statistics.

**Methods:**
- `getProfile()` - Get user profile
- `updateProfile()` - Update profile info
- `uploadAvatar()` - Upload user avatar
- `getStatistics()` - Get user civic stats
- `getUserContributions()` - Get user's contributions (paginated)
- `getLeaderboardPosition()` - Get rank and top contributors
- `getBadges()` - Get user badges
- `getNotificationPreferences()` - Get notification settings
- `updateNotificationPreferences()` - Update notification settings
- `deactivateAccount()` - Deactivate user account

---

### 3. **Society Controller** (`server/controllers/societyController.js`)
Manages society/community data.

**Methods:**
- `createSociety()` - Create new society
- `getSociety()` - Get society details
- `updateSociety()` - Update society info
- `getSocietyMembers()` - Get members with filtering & pagination
- `getSocietyStatistics()` - Get society stats (issues, resolutions, etc.)
- `addCommunityLeader()` - Promote user to community leader
- `getNearBySocieties()` - Find nearby societies using geospatial queries
- `searchSocieties()` - Search societies by name, city, pinCode

---

### 4. **Issue Controller** (`server/controllers/issueController.js`)
Manages civic issues.

**Methods:**
- `createIssue()` - Create new issue
- `getIssues()` - Get issues with filtering & sorting
- `getIssueById()` - Get detailed issue info
- `addContribution()` - Add verification/contribution to issue
- `updateIssueStatus()` - Update issue status
- `escalateIssue()` - Escalate issue to authorities
- `getNearbyIssues()` - Find nearby issues using geospatial queries

**Features:**
- Criticality calculation based on contributions & age
- Automatic authority notification
- Society statistics update
- Points awarding system

---

### 5. **Task Controller** (`server/controllers/taskController.js`)
Manages micro-tasks.

**Methods:**
- `createTask()` - Create new task
- `getTasks()` - Get all tasks with filtering
- `getTaskById()` - Get task details
- `acceptTask()` - User accepts task
- `submitTask()` - Submit completed task
- `verifyTask()` - Verify task submission
- `getNearbyTasks()` - Find nearby tasks
- `getUserTaskAssignments()` - Get user's task assignments

**Features:**
- Location-based task assignment
- Volunteer notification system
- Points & reliability score updates
- Task verification workflow

---

### 6. **Analysis Controller** (`server/controllers/analysisController.js`)
Manages AI image analysis results.

**Methods:**
- `analyzeIssue()` - Create analysis record after Gemini analysis
- `getAnalysisByIssue()` - Get analysis for specific issue
- `verifyAnalysis()` - Verify & approve AI analysis
- `getAnalysisMetrics()` - Get analysis statistics
- `getUnverifiedAnalyses()` - Get pending analysis records

**Features:**
- Integration with Gemini API results
- Manual correction tracking
- Quality metrics calculation
- Category & severity detection

---

### 7. **Contribution Controller** (`server/controllers/contributionController.js`)
Manages user contributions to issues.

**Methods:**
- `createContribution()` - Create new contribution
- `getContributionsByIssue()` - Get contributions for issue
- `getUserContributions()` - Get user's contributions
- `verifyContribution()` - Approve/reject contribution
- `rateContribution()` - Rate contribution as helpful
- `getPendingContributions()` - Get unverified contributions
- `getContributionStats()` - Get contribution statistics

**Features:**
- Automatic issue criticality recalculation
- Points & badge awarding
- Verification workflow

---

### 8. **Notification Controller** (`server/controllers/notificationController.js`)
Manages user notifications.

**Methods:**
- `getUserNotifications()` - Get user's notifications
- `markAsRead()` - Mark single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `archiveNotification()` - Archive notification
- `deleteNotification()` - Delete notification
- `getUnreadCount()` - Get unread notification count
- `getNotificationsByType()` - Filter notifications by type
- `createNotification()` - Create notification (internal use)
- `getNotificationStats()` - Get notification statistics
- `broadcastNotification()` - Send to multiple users (admin only)

---

## MIDDLEWARE CREATED (2 Middleware)

### 1. **Auth Middleware** (`server/middleware/authMiddleware.js`)
- Validates JWT token from request header
- Adds user info to request object
- Sends 401 if token missing or invalid

### 2. **Role Middleware** (`server/middleware/roleMiddleware.js`)
- Authorization based on user role
- Supports multiple allowed roles
- Sends 403 if user doesn't have required role

---

## UTILITY FILES CREATED (4 Utilities)

### 1. **Validators** (`server/utils/validators.js`)
Validation functions for:
- Email, phone, password, pinCode
- Latitude, longitude, coordinates
- Image URLs, dates
- Role, status, type validations

### 2. **Response Formatter** (`server/utils/responseFormatter.js`)
Standardized response formats for:
- Success responses
- Error responses
- Paginated responses
- Validation error responses

### 3. **Error Handler** (`server/utils/errorHandler.js`)
- Custom AppError class
- Async handler for try-catch
- Global error handling middleware
- Handles Mongoose, JWT, and custom errors

### 4. **Constants** (`server/utils/constants.js`)
Centralized constants for:
- Roles, statuses, categories
- Notification types, priority levels
- Points system
- Error & success messages
- Geospatial constants

---

## DATABASE INDEXES

All models have appropriate indexes for:
- `societyId` - Fast society queries
- `status` - Fast status filtering
- `createdAt` - Time-based sorting
- Geospatial `coordinates` - Location queries
- Role, category, type - Category filtering

---

## KEY FEATURES IMPLEMENTED

✅ **User Management**: Registration, login, profiles, roles, statistics
✅ **Issue Tracking**: Create, update, escalate, search by location
✅ **Criticality System**: Auto-calculated based on age + contributions
✅ **Contribution System**: Track all contributions with verification
✅ **Micro-Tasks**: Task assignment, submission, verification
✅ **AI Analysis**: Integration points for image analysis results
✅ **Notifications**: Real-time alerts for all events
✅ **Geospatial**: Find nearby issues/tasks/societies
✅ **Points System**: Award points for various actions
✅ **Role-Based Access**: Different permissions for different roles

---

## NEXT STEPS

1. **Create Routes**: Map controllers to API endpoints
2. **Update Server.js**: Add all routes and middleware
3. **Setup Database**: Configure MongoDB connection
4. **Environment Variables**: Create .env with all keys
5. **Test Endpoints**: Use Postman/Insomnia to test
6. **Frontend Integration**: Connect frontend services to these endpoints
7. **AI Integration**: Integrate Gemini API for image analysis
8. **Email Service**: Setup Node Mailer for notifications

---

## DATABASE RELATIONSHIPS

```
Society
├── Users (many)
├── Issues (many)
├── Tasks (many)
└── Notifications (many)

User
├── Issues (reported)
├── Contributions (made)
├── Tasks (assigned to)
└── Notifications (received)

Issue
├── Contributions (many)
├── Verifications (many)
├── Tasks (related)
└── Analysis (one)

Task
├── Assignments (many)
└── Issue (related)
```

---

## FILE STRUCTURE

```
server/
├── models/
│   ├── User.js
│   ├── Society.js
│   ├── Issue.js
│   ├── Contribution.js
│   ├── Task.js
│   ├── Analysis.js
│   ├── Notification.js
│   └── Badge.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── societyController.js
│   ├── issueController.js
│   ├── taskController.js
│   ├── analysisController.js
│   ├── contributionController.js
│   └── notificationController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── utils/
│   ├── validators.js
│   ├── responseFormatter.js
│   ├── errorHandler.js
│   └── constants.js
└── server.js
```

---

**Created on:** 2026-02-20
**Version:** 1.0.0
**Status:** Ready for Route Setup
