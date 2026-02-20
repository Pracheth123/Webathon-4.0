// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (10 digit Indian phone)
const isValidPhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Password strength validation
const isStrongPassword = (password) => {
  if (password.length < 6) return false;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
};

// Latitude validation
const isValidLatitude = (lat) => {
  const latitude = parseFloat(lat);
  return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
};

// Longitude validation
const isValidLongitude = (lng) => {
  const longitude = parseFloat(lng);
  return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
};

// Pincode validation (6 digit Indian pincode)
const isValidPinCode = (pinCode) => {
  const pincodeRegex = /^[0-9]{6}$/;
  return pincodeRegex.test(pinCode);
};

// Validate image URL
const isValidImageUrl = (url) => {
  if (!url) return false;
  const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
  return imageRegex.test(url);
};

// Sanitize user input - remove HTML tags
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.replace(/[<>]/g, "");
};

// Validate date format
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Validate coordinates
const isValidCoordinates = (latitude, longitude) => {
  return isValidLatitude(latitude) && isValidLongitude(longitude);
};

// Validate role
const isValidRole = (role) => {
  const validRoles = ["volunteer", "community_leader", "municipal_official", "admin"];
  return validRoles.includes(role);
};

// Validate issue status
const isValidIssueStatus = (status) => {
  const validStatuses = ["open", "in-progress", "under-review", "resolved", "closed"];
  return validStatuses.includes(status);
};

// Validate task status
const isValidTaskStatus = (status) => {
  const validStatuses = ["open", "in-progress", "completed", "expired", "cancelled"];
  return validStatuses.includes(status);
};

// Validate contribution type
const isValidContributionType = (type) => {
  const validTypes = ["verification", "additional-evidence", "description", "comment"];
  return validTypes.includes(type);
};

// Validate criticality level
const isValidCriticalityLevel = (level) => {
  const validLevels = [1, 2, 3, 4, 5];
  return validLevels.includes(parseInt(level));
};

// Validate severity
const isValidSeverity = (severity) => {
  const validSeverities = ["low", "medium", "high", "critical"];
  return validSeverities.includes(severity);
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isStrongPassword,
  isValidLatitude,
  isValidLongitude,
  isValidPinCode,
  isValidImageUrl,
  sanitizeInput,
  isValidDate,
  isValidCoordinates,
  isValidRole,
  isValidIssueStatus,
  isValidTaskStatus,
  isValidContributionType,
  isValidCriticalityLevel,
  isValidSeverity
};
