const PicoYPlacaRule = require('../../src/models/PicoYPlacaRule');

describe('PicoYPlacaRule', () => {
  let rule;

  beforeEach(() => {
    rule = new PicoYPlacaRule();
  });

  describe('getRestrictedDigits()', () => {
    test('should return correct restricted digits for Monday', () => {
      expect(rule.getRestrictedDigits(1)).toEqual([1, 2]);
    });

    test('should return correct restricted digits for Tuesday', () => {
      expect(rule.getRestrictedDigits(2)).toEqual([3, 4]);
    });

    test('should return correct restricted digits for Wednesday', () => {
      expect(rule.getRestrictedDigits(3)).toEqual([5, 6]);
    });

    test('should return correct restricted digits for Thursday', () => {
      expect(rule.getRestrictedDigits(4)).toEqual([7, 8]);
    });

    test('should return correct restricted digits for Friday', () => {
      expect(rule.getRestrictedDigits(5)).toEqual([9, 0]);
    });

    test('should return null for Saturday (no restrictions)', () => {
      expect(rule.getRestrictedDigits(6)).toBeNull();
    });

    test('should return null for Sunday (no restrictions)', () => {
      expect(rule.getRestrictedDigits(0)).toBeNull();
    });
  });

  describe('isWithinRestrictedHours()', () => {
    test('should return true for morning restriction window', () => {
      expect(rule.isWithinRestrictedHours('07:00')).toBe(true); // Start
      expect(rule.isWithinRestrictedHours('08:00')).toBe(true); // Middle
      expect(rule.isWithinRestrictedHours('09:30')).toBe(true); // End
      expect(rule.isWithinRestrictedHours('07:15')).toBe(true);
      expect(rule.isWithinRestrictedHours('09:00')).toBe(true);
    });

    test('should return true for afternoon restriction window', () => {
      expect(rule.isWithinRestrictedHours('16:00')).toBe(true); // Start
      expect(rule.isWithinRestrictedHours('17:30')).toBe(true); // Middle
      expect(rule.isWithinRestrictedHours('19:30')).toBe(true); // End
      expect(rule.isWithinRestrictedHours('18:00')).toBe(true);
      expect(rule.isWithinRestrictedHours('19:00')).toBe(true);
    });

    test('should return false outside restricted hours', () => {
      expect(rule.isWithinRestrictedHours('06:59')).toBe(false); // Before morning
      expect(rule.isWithinRestrictedHours('09:31')).toBe(false); // After morning
      expect(rule.isWithinRestrictedHours('15:59')).toBe(false); // Before afternoon
      expect(rule.isWithinRestrictedHours('19:31')).toBe(false); // After afternoon
      expect(rule.isWithinRestrictedHours('00:00')).toBe(false); // Midnight
      expect(rule.isWithinRestrictedHours('12:00')).toBe(false); // Noon
      expect(rule.isWithinRestrictedHours('23:59')).toBe(false); // Late night
    });

    test('should handle edge times correctly', () => {
      expect(rule.isWithinRestrictedHours('06:00')).toBe(false);
      expect(rule.isWithinRestrictedHours('10:00')).toBe(false);
      expect(rule.isWithinRestrictedHours('15:00')).toBe(false);
      expect(rule.isWithinRestrictedHours('20:00')).toBe(false);
    });
  });

  describe('isRestricted()', () => {
    test('should restrict correct digits on Monday during restricted hours', () => {
      expect(rule.isRestricted(1, 1, '08:00')).toBe(true);
      expect(rule.isRestricted(2, 1, '08:00')).toBe(true);
      expect(rule.isRestricted(3, 1, '08:00')).toBe(false);
      expect(rule.isRestricted(4, 1, '08:00')).toBe(false);
    });

    test('should restrict correct digits on Tuesday during restricted hours', () => {
      expect(rule.isRestricted(3, 2, '17:00')).toBe(true);
      expect(rule.isRestricted(4, 2, '17:00')).toBe(true);
      expect(rule.isRestricted(1, 2, '17:00')).toBe(false);
      expect(rule.isRestricted(5, 2, '17:00')).toBe(false);
    });

    test('should restrict correct digits on Wednesday during restricted hours', () => {
      expect(rule.isRestricted(5, 3, '07:30')).toBe(true);
      expect(rule.isRestricted(6, 3, '07:30')).toBe(true);
      expect(rule.isRestricted(7, 3, '07:30')).toBe(false);
    });

    test('should restrict correct digits on Thursday during restricted hours', () => {
      expect(rule.isRestricted(7, 4, '18:00')).toBe(true);
      expect(rule.isRestricted(8, 4, '18:00')).toBe(true);
      expect(rule.isRestricted(9, 4, '18:00')).toBe(false);
    });

    test('should restrict correct digits on Friday during restricted hours', () => {
      expect(rule.isRestricted(9, 5, '08:30')).toBe(true);
      expect(rule.isRestricted(0, 5, '08:30')).toBe(true);
      expect(rule.isRestricted(1, 5, '08:30')).toBe(false);
    });

    test('should not restrict any digit on weekends', () => {
      // Saturday
      expect(rule.isRestricted(0, 6, '08:00')).toBe(false);
      expect(rule.isRestricted(5, 6, '08:00')).toBe(false);
      expect(rule.isRestricted(9, 6, '17:00')).toBe(false);

      // Sunday
      expect(rule.isRestricted(0, 0, '08:00')).toBe(false);
      expect(rule.isRestricted(5, 0, '08:00')).toBe(false);
      expect(rule.isRestricted(9, 0, '17:00')).toBe(false);
    });

    test('should not restrict during non-restricted hours', () => {
      // Monday, restricted digits but outside hours
      expect(rule.isRestricted(1, 1, '10:00')).toBe(false);
      expect(rule.isRestricted(2, 1, '12:00')).toBe(false);
      expect(rule.isRestricted(1, 1, '06:00')).toBe(false);
      expect(rule.isRestricted(2, 1, '20:00')).toBe(false);
    });

    test('should handle all scenarios from use cases', () => {
      // Scenario 1: Plate ending in 4, Monday at 8:00 AM
      expect(rule.isRestricted(4, 1, '08:00')).toBe(false);

      // Scenario 2: Plate ending in 8, Wednesday at 17:00 (5:00 PM)
      expect(rule.isRestricted(8, 3, '17:00')).toBe(false);

      // Scenario 3: Plate ending in 0, Friday at 7:15 AM
      expect(rule.isRestricted(0, 5, '07:15')).toBe(true);

      // Scenario 4: Plate ending in 1, Monday at 10:00 AM (outside hours)
      expect(rule.isRestricted(1, 1, '10:00')).toBe(false);
    });
  });

  describe('timeToMinutes()', () => {
    test('should convert time to minutes correctly', () => {
      expect(rule.timeToMinutes('00:00')).toBe(0);
      expect(rule.timeToMinutes('01:00')).toBe(60);
      expect(rule.timeToMinutes('12:00')).toBe(720);
      expect(rule.timeToMinutes('23:59')).toBe(1439);
      expect(rule.timeToMinutes('08:30')).toBe(510);
      expect(rule.timeToMinutes('17:45')).toBe(1065);
    });
  });

  describe('edge cases and comprehensive tests', () => {
    test('should handle all digits 0-9 correctly', () => {
      for (let digit = 0; digit <= 9; digit++) {
        const result = rule.isRestricted(digit, 1, '08:00');
        if (digit === 1 || digit === 2) {
          expect(result).toBe(true);
        } else {
          expect(result).toBe(false);
        }
      }
    });

    test('should be consistent across multiple calls', () => {
      expect(rule.isRestricted(1, 1, '08:00')).toBe(true);
      expect(rule.isRestricted(1, 1, '08:00')).toBe(true);
      expect(rule.isRestricted(1, 1, '08:00')).toBe(true);
    });
  });
});
