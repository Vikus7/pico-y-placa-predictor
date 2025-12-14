const DateValidator = require('../../src/validators/DateValidator');

describe('DateValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new DateValidator();
  });

  describe('validate()', () => {
    test('should validate correct date format with slashes', () => {
      expect(validator.validate('15/03/2024')).toBe(true);
      expect(validator.validate('01/01/2024')).toBe(true);
      expect(validator.validate('31/12/2024')).toBe(true);
    });

    test('should validate correct date format with hyphens', () => {
      expect(validator.validate('15-03-2024')).toBe(true);
      expect(validator.validate('01-01-2024')).toBe(true);
      expect(validator.validate('31-12-2024')).toBe(true);
    });

    test('should validate dates with extra whitespace', () => {
      expect(validator.validate('  15/03/2024  ')).toBe(true);
      expect(validator.validate(' 01-01-2024 ')).toBe(true);
    });

    test('should reject dates with wrong format', () => {
      expect(validator.validate('2024-03-15')).toBe(false); // YYYY-MM-DD
      expect(validator.validate('03/15/2024')).toBe(false); // MM/DD/YYYY
      expect(validator.validate('15.03.2024')).toBe(false); // Wrong separator
      expect(validator.validate('15/3/2024')).toBe(false);  // Single digit month
      expect(validator.validate('5/03/2024')).toBe(false);  // Single digit day
    });

    test('should reject invalid dates', () => {
      expect(validator.validate('32/01/2024')).toBe(false); // Day 32
      expect(validator.validate('31/02/2024')).toBe(false); // Feb 31
      expect(validator.validate('29/02/2023')).toBe(false); // Feb 29 non-leap year
      expect(validator.validate('00/01/2024')).toBe(false); // Day 0
      expect(validator.validate('15/13/2024')).toBe(false); // Month 13
      expect(validator.validate('15/00/2024')).toBe(false); // Month 0
    });

    test('should validate leap year dates', () => {
      expect(validator.validate('29/02/2024')).toBe(true);  // 2024 is leap year
      expect(validator.validate('29/02/2020')).toBe(true);  // 2020 is leap year
    });

    test('should validate different months correctly', () => {
      expect(validator.validate('31/01/2024')).toBe(true);  // January has 31 days
      expect(validator.validate('28/02/2024')).toBe(true);  // February valid
      expect(validator.validate('31/03/2024')).toBe(true);  // March has 31 days
      expect(validator.validate('30/04/2024')).toBe(true);  // April has 30 days
      expect(validator.validate('31/04/2024')).toBe(false); // April doesn't have 31
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
  });

  describe('getValidationError()', () => {
    test('should return null for valid dates', () => {
      expect(validator.getValidationError('15/03/2024')).toBeNull();
      expect(validator.getValidationError('01-12-2024')).toBeNull();
      expect(validator.getValidationError('29/02/2024')).toBeNull();
    });

    test('should return error for null or undefined', () => {
      expect(validator.getValidationError(null)).toBe(
        'Date is required and must be a string'
      );
      expect(validator.getValidationError(undefined)).toBe(
        'Date is required and must be a string'
      );
    });

    test('should return error for empty string', () => {
      expect(validator.getValidationError('')).toBe('Date cannot be empty');
      expect(validator.getValidationError('   ')).toBe('Date cannot be empty');
    });

    test('should return error for wrong format', () => {
      const error = validator.getValidationError('2024-03-15');
      expect(error).toBe(
        'Date must be in format DD/MM/YYYY or DD-MM-YYYY (e.g., 15/03/2024 or 15-03-2024)'
      );
    });

    test('should return error for invalid month', () => {
      expect(validator.getValidationError('15/13/2024')).toBe(
        'Month must be between 01 and 12'
      );
      expect(validator.getValidationError('15/00/2024')).toBe(
        'Month must be between 01 and 12'
      );
    });

    test('should return error for invalid day', () => {
      expect(validator.getValidationError('32/01/2024')).toBe(
        'Day must be between 01 and 31'
      );
      expect(validator.getValidationError('00/01/2024')).toBe(
        'Day must be between 01 and 31'
      );
    });

    test('should return error for non-existent dates', () => {
      const error = validator.getValidationError('31/02/2024');
      expect(error).toContain('Invalid date');
      expect(error).toContain('does not exist in the calendar');
    });

    test('should return error for non-string values', () => {
      expect(validator.getValidationError(123)).toBe(
        'Date is required and must be a string'
      );
    });
  });
});
