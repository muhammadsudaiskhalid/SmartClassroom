import bcrypt from 'bcryptjs';

class SecurityService {
  constructor() {
    this.loginAttempts = new Map();
    this.RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
    this.MAX_ATTEMPTS = 5;
    this.LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  }

  /**
   * Hash a password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to secure password');
    }
  }

  /**
   * Verify a password against a hash
   * @param {string} password - Plain text password
   * @param {string} hashedPassword - Hashed password to compare against
   * @returns {Promise<boolean>} - True if password matches
   */
  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Check if login attempts are within rate limit
   * @param {string} identifier - User identifier (email, IP, etc.)
   * @returns {Object} - { allowed: boolean, remainingAttempts: number, retryAfter: number }
   */
  checkRateLimit(identifier) {
    const now = Date.now();
    const attempt = this.loginAttempts.get(identifier);

    if (!attempt) {
      this.loginAttempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        lockedUntil: null
      });
      return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS - 1, retryAfter: 0 };
    }

    // Check if user is currently locked out
    if (attempt.lockedUntil && now < attempt.lockedUntil) {
      const retryAfter = Math.ceil((attempt.lockedUntil - now) / 1000);
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        retryAfter,
        locked: true
      };
    }

    // Reset if window has passed
    if (now - attempt.firstAttempt > this.RATE_LIMIT_WINDOW) {
      this.loginAttempts.set(identifier, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
        lockedUntil: null
      });
      return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS - 1, retryAfter: 0 };
    }

    // Increment attempts
    attempt.count++;
    attempt.lastAttempt = now;

    // Lock if exceeded max attempts
    if (attempt.count > this.MAX_ATTEMPTS) {
      attempt.lockedUntil = now + this.LOCKOUT_DURATION;
      this.loginAttempts.set(identifier, attempt);
      const retryAfter = Math.ceil(this.LOCKOUT_DURATION / 1000);
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        retryAfter,
        locked: true
      };
    }

    this.loginAttempts.set(identifier, attempt);
    return { 
      allowed: true, 
      remainingAttempts: this.MAX_ATTEMPTS - attempt.count, 
      retryAfter: 0 
    };
  }

  /**
   * Reset rate limit for a user (e.g., after successful login)
   * @param {string} identifier - User identifier
   */
  resetRateLimit(identifier) {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Sanitize input to prevent XSS attacks
   * @param {string} input - User input
   * @returns {string} - Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - { valid: boolean, errors: string[] }
   */
  validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
      strength: this.calculatePasswordStrength(password)
    };
  }

  /**
   * Calculate password strength score
   * @param {string} password
   * @returns {string} - 'weak', 'medium', 'strong', 'very-strong'
   */
  calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 3) return 'weak';
    if (score <= 5) return 'medium';
    if (score <= 6) return 'strong';
    return 'very-strong';
  }

  /**
   * Generate a secure random token
   * @param {number} length - Token length
   * @returns {string} - Random token
   */
  generateSecureToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length];
    }
    
    return token;
  }

  /**
   * Clean up old rate limit entries
   */
  cleanupRateLimits() {
    const now = Date.now();
    const cutoff = now - this.RATE_LIMIT_WINDOW;
    
    for (const [identifier, attempt] of this.loginAttempts.entries()) {
      if (attempt.lastAttempt < cutoff && (!attempt.lockedUntil || attempt.lockedUntil < now)) {
        this.loginAttempts.delete(identifier);
      }
    }
  }
}

// Singleton instance
const securityService = new SecurityService();

// Clean up old entries every 10 minutes
setInterval(() => {
  securityService.cleanupRateLimits();
}, 10 * 60 * 1000);

export default securityService;
