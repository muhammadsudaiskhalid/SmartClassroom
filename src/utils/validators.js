// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email?.trim());
};

// Password validation (min 6 characters, at least one letter and one number)
export const isValidPassword = (password) => {
  if (!password || password.length < 6) return false;
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasLetter && hasNumber;
};

// Strong password validation (min 8 chars, letter, number, special char)
export const isStrongPassword = (password) => {
  if (!password || password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // eslint-disable-next-line no-useless-escape
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return hasLetter && hasNumber && hasSpecial;
};

// Name validation (2-50 chars, letters and spaces only)
export const isValidName = (name) => {
  if (!name || name.trim().length < 2 || name.trim().length > 50) return false;
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name.trim());
};

// Registration number validation (alphanumeric with dash, 5-20 chars)
export const isValidRegistrationNumber = (regNo) => {
  if (!regNo) return false;
  const regNoRegex = /^[A-Za-z0-9-]+$/;
  return regNo.length >= 5 && regNo.length <= 20 && regNoRegex.test(regNo);
};

// Check if string is empty
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

// Validate class name (3-50 chars)
export const isValidClassName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 50;
};

// Validate subject (2-50 chars)
export const isValidSubject = (subject) => {
  return subject && subject.trim().length >= 2 && subject.trim().length <= 50;
};

// Validate minutes content (minimum 10 chars)
export const isValidMinutesContent = (content) => {
  return content && content.trim().length >= 10;
};

// Validate URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate phone number (basic international format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phone && phone.length >= 10 && phone.length <= 15 && phoneRegex.test(phone);
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