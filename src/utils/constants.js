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

// Universities in Pakistan
export const UNIVERSITIES = [
  'University of Punjab',
  'Lahore College for Women University',
  'University of the Punjab',
  'Institute of Space Technology (IST)',
  'University of Agriculture Faisalabad',
  'University of Peshawar',
  'Quaid-e-Azam University',
  'University of Sargodha',
  'University of Gujrat',
  'Islamia University of Bahawalpur',
  'Bahauddin Zakariya University',
  'University of Azad Jammu and Kashmir',
  'Khyber Medical University',
  'Dow University of Health Sciences',
  'Aga Khan University',
  'Ziauddin University',
  'Liaquat University of Medical and Health Sciences',
  'King Edward Medical University',
  'Allama Iqbal Medical College',
  'Fatima Jinnah Medical University',
  'Jinnah Sindh Medical University',
  'University of Veterinary and Animal Sciences',
  'Pakistan Institute of Development Economics (PIDE)',
  'COMSATS University Islamabad',
  'National University of Sciences and Technology (NUST)',
  'Pakistan Institute of Engineering and Applied Sciences (PIEAS)',
  'Shifa Tameer-e-Millat University',
  'Air University',
  'Bahria University',
  'FAST National University',
  'University of Engineering and Technology (UET) Lahore',
  'Punjab University',
  'University of Karachi',
  'NED University of Engineering and Technology',
  'Ghulam Ishaq Khan Institute (GIKI)',
  'Lahore University of Management Sciences (LUMS)',
  'Institute of Business Administration (IBA) Karachi',
  'University of Central Punjab',
  'Superior University',
  'Virtual University of Pakistan',
  'Allama Iqbal Open University',
  'University of Management and Technology (UMT)',
  'Riphah International University',
  'Iqra University',
  'Indus Valley School of Art and Architecture',
  'National University of Modern Languages (NUML)'
];

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