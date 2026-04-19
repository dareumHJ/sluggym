/**
 * Validation utilities for auth forms.
 * Covers email format, password strength, and name checks.
 */

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

const UCSC_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@ucsc\.edu$/i;
const GENERAL_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validate email address.
 * Accepts any valid email but shows a hint for non-UCSC emails.
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!GENERAL_EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  if (!UCSC_EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: 'Please use your UCSC email (@ucsc.edu)' };
  }

  return { isValid: true, message: '' };
}

/**
 * Validate password strength.
 * Requirements: min 8 chars, at least one uppercase, one lowercase, one number.
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must include an uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must include a lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must include a number' };
  }

  return { isValid: true, message: '' };
}

/**
 * Validate display name.
 */
export function validateName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, message: 'Name is required' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters' };
  }

  if (trimmed.length > 50) {
    return { isValid: false, message: 'Name must be under 50 characters' };
  }

  return { isValid: true, message: '' };
}

/**
 * Check if all fields pass validation before enabling submit.
 */
export function isFormValid(results: ValidationResult[]): boolean {
  return results.every((r) => r.isValid);
}
