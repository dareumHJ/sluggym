import {
  isFormValid,
  validateEmail,
  validateName,
  validatePassword,
} from '../src/lib/validation';

// ─── validateEmail ────────────────────────────────────────────────────────────

describe('validateEmail', () => {
  it('rejects an empty string', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Email is required');
  });

  it('rejects whitespace-only input as empty', () => {
    const result = validateEmail('   ');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Email is required');
  });

  it('rejects strings that are not a valid email format', () => {
    expect(validateEmail('notanemail').isValid).toBe(false);
    expect(validateEmail('notanemail').message).toBe('Please enter a valid email address');
    expect(validateEmail('@ucsc.edu').isValid).toBe(false);
    expect(validateEmail('user@').isValid).toBe(false);
    expect(validateEmail('user @ucsc.edu').isValid).toBe(false);
  });

  it('rejects valid general emails that are not @ucsc.edu', () => {
    expect(validateEmail('user@gmail.com').isValid).toBe(false);
    expect(validateEmail('user@gmail.com').message).toBe('Please use your UCSC email (@ucsc.edu)');
    expect(validateEmail('user@stanford.edu').isValid).toBe(false);
  });

  it('accepts valid @ucsc.edu addresses', () => {
    expect(validateEmail('slug@ucsc.edu').isValid).toBe(true);
    expect(validateEmail('first.last@ucsc.edu').isValid).toBe(true);
    expect(validateEmail('user123@ucsc.edu').isValid).toBe(true);
    expect(validateEmail('a.b+tag@ucsc.edu').isValid).toBe(true);
  });

  it('is case-insensitive for the domain', () => {
    expect(validateEmail('SLUG@UCSC.EDU').isValid).toBe(true);
    expect(validateEmail('Slug@Ucsc.Edu').isValid).toBe(true);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(validateEmail('  slug@ucsc.edu  ').isValid).toBe(true);
  });
});

// ─── validatePassword ─────────────────────────────────────────────────────────

describe('validatePassword', () => {
  it('rejects an empty password', () => {
    expect(validatePassword('').isValid).toBe(false);
    expect(validatePassword('').message).toBe('Password is required');
  });

  it('rejects passwords shorter than 8 characters (BVA: 7 chars)', () => {
    expect(validatePassword('Abc123!').isValid).toBe(false);
    expect(validatePassword('Abc123!').message).toBe('Password must be at least 8 characters');
  });

  it('accepts passwords of exactly 8 characters (BVA: lower boundary)', () => {
    expect(validatePassword('Abcde12!').isValid).toBe(true);
  });

  it('rejects passwords without an uppercase letter', () => {
    expect(validatePassword('abcde123').isValid).toBe(false);
    expect(validatePassword('abcde123').message).toBe('Password must include an uppercase letter');
  });

  it('rejects passwords without a lowercase letter', () => {
    expect(validatePassword('ABCDE123').isValid).toBe(false);
    expect(validatePassword('ABCDE123').message).toBe('Password must include a lowercase letter');
  });

  it('rejects passwords without a number', () => {
    expect(validatePassword('Abcdefgh').isValid).toBe(false);
    expect(validatePassword('Abcdefgh').message).toBe('Password must include a number');
  });

  it('accepts a password that meets all requirements', () => {
    expect(validatePassword('SecurePass1').isValid).toBe(true);
    expect(validatePassword('SecurePass1').message).toBe('');
  });

  it('evaluates requirements in declaration order (length checked first)', () => {
    // 'Ab1' is short AND missing chars — should report length first
    expect(validatePassword('Ab1').message).toBe('Password must be at least 8 characters');
  });
});

// ─── validateName ─────────────────────────────────────────────────────────────

describe('validateName', () => {
  it('rejects an empty name', () => {
    expect(validateName('').isValid).toBe(false);
    expect(validateName('').message).toBe('Name is required');
  });

  it('rejects whitespace-only names', () => {
    expect(validateName('   ').isValid).toBe(false);
    expect(validateName('   ').message).toBe('Name is required');
  });

  it('rejects names shorter than 2 characters (BVA: 1 char)', () => {
    expect(validateName('A').isValid).toBe(false);
    expect(validateName('A').message).toBe('Name must be at least 2 characters');
  });

  it('accepts names of exactly 2 characters (BVA: lower boundary)', () => {
    expect(validateName('Jo').isValid).toBe(true);
  });

  it('accepts names of exactly 50 characters (BVA: upper boundary)', () => {
    expect(validateName('A'.repeat(50)).isValid).toBe(true);
  });

  it('rejects names exceeding 50 characters (BVA: 51 chars)', () => {
    expect(validateName('A'.repeat(51)).isValid).toBe(false);
    expect(validateName('A'.repeat(51)).message).toBe('Name must be under 50 characters');
  });

  it('trims whitespace before checking length', () => {
    // '  A  ' trims to 'A' → length 1 → invalid
    expect(validateName('  A  ').isValid).toBe(false);
    // '  Jo  ' trims to 'Jo' → length 2 → valid
    expect(validateName('  Jo  ').isValid).toBe(true);
  });

  it('accepts a typical full name', () => {
    expect(validateName('Hajun Park').isValid).toBe(true);
  });
});

// ─── isFormValid ──────────────────────────────────────────────────────────────

describe('isFormValid', () => {
  it('returns true when all results are valid', () => {
    expect(isFormValid([
      { isValid: true, message: '' },
      { isValid: true, message: '' },
    ])).toBe(true);
  });

  it('returns false when any single result is invalid', () => {
    expect(isFormValid([
      { isValid: true, message: '' },
      { isValid: false, message: 'Password is required' },
    ])).toBe(false);
  });

  it('returns false when all results are invalid', () => {
    expect(isFormValid([
      { isValid: false, message: 'Email is required' },
      { isValid: false, message: 'Password is required' },
    ])).toBe(false);
  });

  it('returns true for an empty array (vacuously valid)', () => {
    expect(isFormValid([])).toBe(true);
  });
});
