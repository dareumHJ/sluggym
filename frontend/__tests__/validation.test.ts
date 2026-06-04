import { validateWorkoutReps, validateWorkoutSetCount, validateWorkoutWeight } from '../src/lib/validation';

describe('workout validation', () => {
  it('accepts valid workout weight values', () => {
    expect(validateWorkoutWeight('0').isValid).toBe(true);
    expect(validateWorkoutWeight('185').isValid).toBe(true);
    expect(validateWorkoutWeight(42.5).isValid).toBe(true);
  });

  it('rejects invalid workout weight values', () => {
    expect(validateWorkoutWeight('').message).toBe('Weight is required');
    expect(validateWorkoutWeight('abc').message).toBe('Weight must be a number');
    expect(validateWorkoutWeight('-1').message).toBe('Weight cannot be negative');
    expect(validateWorkoutWeight('1001').message).toBe('Weight looks too high');
  });

  it('accepts and rejects reps according to Sprint 2 rules', () => {
    expect(validateWorkoutReps('1').isValid).toBe(true);
    expect(validateWorkoutReps('12').isValid).toBe(true);
    expect(validateWorkoutReps('').message).toBe('Reps are required');
    expect(validateWorkoutReps('2.5').message).toBe('Reps must be a whole number');
    expect(validateWorkoutReps('0').message).toBe('Reps must be at least 1');
    expect(validateWorkoutReps('501').message).toBe('Reps look too high');
  });

  it('validates workout set counts', () => {
    expect(validateWorkoutSetCount(1).isValid).toBe(true);
    expect(validateWorkoutSetCount(50).isValid).toBe(true);
    expect(validateWorkoutSetCount(0).message).toBe('Add at least one set');
    expect(validateWorkoutSetCount(51).message).toBe('Set count looks too high');
  });
});
