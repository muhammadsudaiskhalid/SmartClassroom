// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2;
};

// Registration number validation (alphanumeric, 5-20 chars)
export const isValidRegistrationNumber = (regNo) => {
  const regNoRegex = /^[A-Za-z0-9-]+$/;
  return regNo && regNo.length >= 5 && regNo.length <= 20 && regNoRegex.test(regNo);
};

// Check if string is empty
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

// Validate class name
export const isValidClassName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 50;
};

// Validate subject
export const isValidSubject = (subject) => {
  return subject && subject.trim().length >= 2 && subject.trim().length <= 30;
};

// Validate minutes content
export const isValidMinutesContent = (content) => {
  return content && content.trim().length >= 10;
};

// Form validation helper
export const validateForm = (fields) => {
  const errors = {};
  
  Object.keys(fields).forEach(key => {
    const value = fields[key];
    
    if (isEmpty(value)) {
      errors[key] = 'This field is required';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};