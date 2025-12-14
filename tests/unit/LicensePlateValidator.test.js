const LicensePlateValidator = require('../../src/validators/LicensePlateValidator');

describe('LicensePlateValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new LicensePlateValidator();
  });

  describe('validate()', () => {
    test('should validate correct license plate format', () => {
      expect(validator.validate('ABC-1234')).toBe(true);
      expect(validator.validate('PBX-5678')).toBe(true);
      expect(validator.validate('XYZ-0000')).toBe(true);
    });

    test('should validate with lowercase letters (auto-normalized)', () => {
      expect(validator.validate('abc-1234')).toBe(true);
      expect(validator.validate('Pbx-5678')).toBe(true);
      expect(validator.validate('aBc-9999')).toBe(true);
    });

    test('should validate with extra whitespace (auto-trimmed)', () => {
      expect(validator.validate('  ABC-1234  ')).toBe(true);
      expect(validator.validate('ABC-1234 ')).toBe(true);
      expect(validator.validate(' PBX-5678')).toBe(true);
    });

    test('should reject plates with wrong number of letters', () => {
      expect(validator.validate('AB-1234')).toBe(false);
      expect(validator.validate('ABCD-1234')).toBe(false);
      expect(validator.validate('A-1234')).toBe(false);
    });

    test('should reject plates with wrong number of digits', () => {
      expect(validator.validate('ABC-123')).toBe(false);
      expect(validator.validate('ABC-12345')).toBe(false);
      expect(validator.validate('ABC-12')).toBe(false);
    });

    test('should reject plates without hyphen', () => {
      expect(validator.validate('ABC1234')).toBe(false);
      expect(validator.validate('ABC 1234')).toBe(false);
    });

    test('should reject plates with special characters', () => {
      expect(validator.validate('AB@-1234')).toBe(false);
      expect(validator.validate('ABC-12#4')).toBe(false);
      expect(validator.validate('ABC_1234')).toBe(false);
    });

    test('should reject plates with numbers in letter section', () => {
      expect(validator.validate('AB1-1234')).toBe(false);
      expect(validator.validate('1BC-1234')).toBe(false);
    });

    test('should reject plates with letters in number section', () => {
      expect(validator.validate('ABC-12A4')).toBe(false);
      expect(validator.validate('ABC-ABCD')).toBe(false);
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
    test('should return null for valid plates', () => {
      expect(validator.getValidationError('ABC-1234')).toBeNull();
      expect(validator.getValidationError('PBX-5678')).toBeNull();
      expect(validator.getValidationError('xyz-0000')).toBeNull();
    });

    test('should return error for null or undefined', () => {
      expect(validator.getValidationError(null)).toBe(
        'License plate is required and must be a string'
      );
      expect(validator.getValidationError(undefined)).toBe(
        'License plate is required and must be a string'
      );
    });

    test('should return error for empty string', () => {
      expect(validator.getValidationError('')).toBe(
        'License plate cannot be empty'
      );
      expect(validator.getValidationError('   ')).toBe(
        'License plate cannot be empty'
      );
    });

    test('should return error for invalid format', () => {
      const error = validator.getValidationError('ABC123');
      expect(error).toBe(
        'License plate must follow the format: ABC-1234 (3 letters, hyphen, 4 digits)'
      );
    });

    test('should return error for non-string values', () => {
      expect(validator.getValidationError(123)).toBe(
        'License plate is required and must be a string'
      );
    });
  });
});
