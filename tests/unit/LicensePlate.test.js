const LicensePlate = require('../../src/models/LicensePlate');

describe('LicensePlate', () => {
  describe('constructor', () => {
    test('should create a license plate with valid input', () => {
      const plate = new LicensePlate('PBX-1234');
      expect(plate.getPlateNumber()).toBe('PBX-1234');
      expect(plate.getLastDigit()).toBe(4);
    });

    test('should normalize to uppercase', () => {
      const plate = new LicensePlate('abc-1234');
      expect(plate.getPlateNumber()).toBe('ABC-1234');
    });

    test('should trim whitespace', () => {
      const plate = new LicensePlate('  PBX-1234  ');
      expect(plate.getPlateNumber()).toBe('PBX-1234');
    });

    test('should throw error for null or undefined', () => {
      expect(() => new LicensePlate(null)).toThrow('License plate number is required and must be a string');
      expect(() => new LicensePlate(undefined)).toThrow('License plate number is required and must be a string');
    });

    test('should throw error for non-string values', () => {
      expect(() => new LicensePlate(123)).toThrow('License plate number is required and must be a string');
      expect(() => new LicensePlate({})).toThrow('License plate number is required and must be a string');
    });

    test('should throw error for plates without digits', () => {
      expect(() => new LicensePlate('ABCDEF')).toThrow('License plate must contain at least one digit');
    });
  });

  describe('extractLastDigit()', () => {
    test('should extract last digit correctly', () => {
      expect(new LicensePlate('ABC-1234').getLastDigit()).toBe(4);
      expect(new LicensePlate('PBX-5678').getLastDigit()).toBe(8);
      expect(new LicensePlate('XYZ-0000').getLastDigit()).toBe(0);
      expect(new LicensePlate('DEF-9999').getLastDigit()).toBe(9);
    });

    test('should handle plates ending in 0', () => {
      expect(new LicensePlate('ABC-1230').getLastDigit()).toBe(0);
      expect(new LicensePlate('XYZ-9990').getLastDigit()).toBe(0);
    });

    test('should extract from different plate formats', () => {
      expect(new LicensePlate('AB-123').getLastDigit()).toBe(3);
      expect(new LicensePlate('ABCD-12345').getLastDigit()).toBe(5);
    });
  });

  describe('getPlateNumber()', () => {
    test('should return the normalized plate number', () => {
      const plate = new LicensePlate('abc-1234');
      expect(plate.getPlateNumber()).toBe('ABC-1234');
    });

    test('should return trimmed plate number', () => {
      const plate = new LicensePlate('  PBX-5678  ');
      expect(plate.getPlateNumber()).toBe('PBX-5678');
    });
  });

  describe('getLastDigit()', () => {
    test('should return the last digit', () => {
      const plate = new LicensePlate('PBX-1234');
      expect(plate.getLastDigit()).toBe(4);
    });

    test('should be consistent across multiple calls', () => {
      const plate = new LicensePlate('ABC-5678');
      expect(plate.getLastDigit()).toBe(8);
      expect(plate.getLastDigit()).toBe(8);
      expect(plate.getLastDigit()).toBe(8);
    });
  });

  describe('toString()', () => {
    test('should return string representation', () => {
      const plate = new LicensePlate('PBX-1234');
      const str = plate.toString();
      expect(str).toContain('PBX-1234');
      expect(str).toContain('4');
    });

    test('should include last digit in string', () => {
      const plate = new LicensePlate('ABC-9999');
      expect(plate.toString()).toContain('9');
    });
  });

  describe('edge cases', () => {
    test('should handle all digits 0-9', () => {
      for (let i = 0; i <= 9; i++) {
        const plate = new LicensePlate(`ABC-123${i}`);
        expect(plate.getLastDigit()).toBe(i);
      }
    });

    test('should handle plates with only one digit', () => {
      const plate = new LicensePlate('ABCDEF-1');
      expect(plate.getLastDigit()).toBe(1);
    });
  });
});
