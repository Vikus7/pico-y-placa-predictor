const TimeValidator = require('../../src/validators/TimeValidator');

describe('TimeValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new TimeValidator();
  });

  describe('validate()', () => {
    test('should validate correct time format', () => {
      expect(validator.validate('08:30')).toBe(true);
      expect(validator.validate('17:00')).toBe(true);
      expect(validator.validate('00:00')).toBe(true);
      expect(validator.validate('23:59')).toBe(true);
    });

    test('should validate single digit hours', () => {
      expect(validator.validate('0:00')).toBe(true);
      expect(validator.validate('9:30')).toBe(true);
      expect(validator.validate('5:45')).toBe(true);
    });

    test('should validate times with extra whitespace', () => {
      expect(validator.validate('  08:30  ')).toBe(true);
      expect(validator.validate(' 17:00 ')).toBe(true);
    });

    test('should reject invalid hour values', () => {
      expect(validator.validate('24:00')).toBe(false); // Hour 24
      expect(validator.validate('25:30')).toBe(false); // Hour 25
      expect(validator.validate('99:00')).toBe(false); // Hour 99
    });

    test('should reject invalid minute values', () => {
      expect(validator.validate('08:60')).toBe(false); // Minute 60
      expect(validator.validate('08:99')).toBe(false); // Minute 99
    });

    test('should reject wrong format', () => {
      expect(validator.validate('8:30 AM')).toBe(false);  // AM/PM format
      expect(validator.validate('8:30 PM')).toBe(false);  // AM/PM format
      expect(validator.validate('8:30am')).toBe(false);   // AM/PM format
      expect(validator.validate('830')).toBe(false);      // No colon
      expect(validator.validate('08-30')).toBe(false);    // Wrong separator
      expect(validator.validate('08.30')).toBe(false);    // Wrong separator
      expect(validator.validate('8:3')).toBe(false);      // Single digit minute
    });

    test('should reject null, undefined, or empty values', () => {
      expect(validator.validate(null)).toBe(false);
      expect(validator.validate(undefined)).toBe(false);
      expect(validator.validate('')).toBe(false);
      expect(validator.validate('   ')).toBe(false);
    });

    test('should reject non-string values', () => {
      expect(validator.validate(123)).toBe(false);
      expect(validator.validate({})).toBe(false);
      expect(validator.validate([])).toBe(false);
    });

    test('should validate edge cases', () => {
      expect(validator.validate('00:00')).toBe(true);  // Midnight
      expect(validator.validate('12:00')).toBe(true);  // Noon
      expect(validator.validate('23:59')).toBe(true);  // Last minute of day
    });
  });

  describe('getValidationError()', () => {
    test('should return null for valid times', () => {
      expect(validator.getValidationError('08:30')).toBeNull();
      expect(validator.getValidationError('17:00')).toBeNull();
      expect(validator.getValidationError('0:00')).toBeNull();
      expect(validator.getValidationError('23:59')).toBeNull();
    });

    test('should return error for null or undefined', () => {
      expect(validator.getValidationError(null)).toBe(
        'Time is required and must be a string'
      );
      expect(validator.getValidationError(undefined)).toBe(
        'Time is required and must be a string'
      );
    });

    test('should return error for empty string', () => {
      expect(validator.getValidationError('')).toBe('Time cannot be empty');
      expect(validator.getValidationError('   ')).toBe('Time cannot be empty');
    });

    test('should return error for wrong format', () => {
      const error = validator.getValidationError('8:30 AM');
      expect(error).toBe(
        'Time must be in 24-hour format HH:MM (e.g., 08:30, 17:00)'
      );
    });

    test('should return error for invalid values', () => {
      expect(validator.getValidationError('24:00')).toBe(
        'Time must be in 24-hour format HH:MM (e.g., 08:30, 17:00)'
      );
      expect(validator.getValidationError('08:60')).toBe(
        'Time must be in 24-hour format HH:MM (e.g., 08:30, 17:00)'
      );
    });

    test('should return error for non-string values', () => {
      expect(validator.getValidationError(123)).toBe(
        'Time is required and must be a string'
      );
    });
  });
});
