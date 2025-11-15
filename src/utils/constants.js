import universitiesList from '../data/universities.json';

// User Types
export const USER_TYPES = {
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Storage Keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'current_user',
  USER_PREFIX: 'user:',
  CLASS_PREFIX: 'class:',
  MINUTES_PREFIX: 'minutes:',
  REQUEST_PREFIX: 'request:',
  STUDENT_CLASSES_PREFIX: 'student_classes:'
};

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CLASS_DETAIL: '/class/:id'
};

// Universities in Pakistan (moved to data file to reduce bundle size)
export const UNIVERSITIES = universitiesList;

// Departments
export const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Information Technology',
  'Artificial Intelligence',
  'Software Engineering',
  'Cyber Security',
  'Data Science',
  'Library Science',
  'Data Science',
  'Cyber Security',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics Engineering',
  'Business Administration',
  'Management Sciences',
  'Economics',
  'Mathematics',
  'Physics',
  'Chemistry',
  'English',
  'Mass Communication',
  'Architecture',
  'Bioinformatics'
];

// Semesters
export const SEMESTERS = [
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester'
];

// Date Format
export const DATE_FORMAT = 'YYYY-MM-DD';

// Messages
export const MESSAGES = {
  AUTH: {
    SIGNIN_SUCCESS: 'Successfully signed in!',
    SIGNUP_SUCCESS: 'Account created successfully!',
    SIGNOUT_SUCCESS: 'Successfully signed out!',
    INVALID_CREDENTIALS: 'Invalid registration number or password',
    USER_NOT_FOUND: 'User not found',
    FILL_ALL_FIELDS: 'Please fill all fields'
  },
  CLASS: {
    CREATE_SUCCESS: 'Class created successfully!',
    CREATE_ERROR: 'Failed to create class',
    JOIN_REQUEST_SENT: 'Join request sent successfully!',
    JOIN_REQUEST_ERROR: 'Failed to send join request',
    ALREADY_REQUESTED: 'You have already requested to join this class',
    ALREADY_ENROLLED: 'You are already enrolled in this class'
  },
  MINUTES: {
    ADD_SUCCESS: 'Class minutes added successfully!',
    ADD_ERROR: 'Failed to add class minutes',
    UPDATE_SUCCESS: 'Class minutes updated successfully!',
    DELETE_SUCCESS: 'Class minutes deleted successfully!'
  }
};

// Admin Configuration
export const ADMIN_CREDENTIALS = {
  username: 'superadmin',
  password: 'admin@iamsudaiskhalid', // Change this to a strong password
  secretKey: 'thisissmartclassroom.sudaiskhalid' // Additional security layer
};


// University Status
export const UNIVERSITY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired'
};

// Subscription Types
export const SUBSCRIPTION_TYPES = {
  TRIAL: 'trial',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
  LIFETIME: 'lifetime'
};


// Admin Types
export const ADMIN_TYPES = {
  SUPER_ADMIN: 'super_admin',
  UNIVERSITY_ADMIN: 'university_admin'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending'
};