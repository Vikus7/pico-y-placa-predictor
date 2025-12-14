const DateParser = require('../../src/parsers/DateParser');

describe('DateParser', () => {
  let parser;

  beforeEach(() => {
    parser = new DateParser();
  });

  describe('parse()', () => {
    test('should parse date with slashes', () => {
      const date = parser.parse('15/03/2024');
      expect(date).toBeInstanceOf(Date);
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(2); // 0-indexed
      expect(date.getFullYear()).toBe(2024);
    });

    test('should parse date with hyphens', () => {
      const date = parser.parse('15-03-2024');
      expect(date).toBeInstanceOf(Date);
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(2);
      expect(date.getFullYear()).toBe(2024);
    });

    test('should parse dates with extra whitespace', () => {
      const date = parser.parse('  15/03/2024  ');
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(2);
    });

    test('should throw error for invalid format', () => {
      expect(() => parser.parse('2024-03-15')).toThrow('Invalid date format');
      expect(() => parser.parse('15.03.2024')).toThrow('Invalid date format');
      expect(() => parser.parse('invalid')).toThrow('Invalid date format');
    });

    test('should throw error for MM/DD/YYYY format (wrong format)', () => {
      // 03/15/2024 would be interpreted as 03 (day) / 15 (month) which is invalid
      expect(() => parser.parse('03/15/2024')).toThrow();
    });

    test('should throw error for invalid dates', () => {
      expect(() => parser.parse('32/01/2024')).toThrow('does not exist in the calendar');
      expect(() => parser.parse('31/02/2024')).toThrow('does not exist in the calendar');
      expect(() => parser.parse('29/02/2023')).toThrow('does not exist in the calendar'); // Non-leap year
    });

    test('should throw error for null or undefined', () => {
      expect(() => parser.parse(null)).toThrow('Date string is required');
      expect(() => parser.parse(undefined)).toThrow('Date string is required');
    });

    test('should throw error for empty string', () => {
      expect(() => parser.parse('')).toThrow('Date string is required');
    });

    test('should parse leap year dates correctly', () => {
      const date = parser.parse('29/02/2024'); // 2024 is leap year
      expect(date.getDate()).toBe(29);
      expect(date.getMonth()).toBe(1); // February
    });

    test('should parse different months correctly', () => {
      expect(parser.parse('31/01/2024').getMonth()).toBe(0); // January
      expect(parser.parse('15/06/2024').getMonth()).toBe(5); // June
      expect(parser.parse('25/12/2024').getMonth()).toBe(11); // December
    });
  });

  describe('getDayOfWeek()', () => {
    test('should return correct day of week', () => {
      // Using known dates
      expect(parser.getDayOfWeek('15/03/2024')).toBe(5); // Friday
      expect(parser.getDayOfWeek('16/03/2024')).toBe(6); // Saturday
      expect(parser.getDayOfWeek('17/03/2024')).toBe(0); // Sunday
      expect(parser.getDayOfWeek('18/03/2024')).toBe(1); // Monday
    });

    test('should work with hyphen separator', () => {
      expect(parser.getDayOfWeek('15-03-2024')).toBe(5); // Friday
    });

    test('should return correct day for different dates', () => {
      expect(parser.getDayOfWeek('01/01/2024')).toBe(1); // Monday
      expect(parser.getDayOfWeek('14/02/2024')).toBe(3); // Wednesday
      expect(parser.getDayOfWeek('25/12/2024')).toBe(3); // Wednesday
    });

    test('should throw error for invalid date', () => {
      expect(() => parser.getDayOfWeek('invalid')).toThrow();
      expect(() => parser.getDayOfWeek('32/01/2024')).toThrow();
    });
  });

  describe('format()', () => {
    test('should format date as readable string', () => {
      const formatted = parser.format('15/03/2024');
      expect(formatted).toContain('Friday');
      expect(formatted).toContain('March');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    test('should format different dates correctly', () => {
      expect(parser.format('01/01/2024')).toContain('Monday');
      expect(parser.format('01/01/2024')).toContain('January');
      
      expect(parser.format('25/12/2024')).toContain('Wednesday');
      expect(parser.format('25/12/2024')).toContain('December');
    });

    test('should work with hyphen separator', () => {
      const formatted = parser.format('15-03-2024');
      expect(formatted).toContain('Friday');
    });
  });

  describe('edge cases', () => {
    test('should handle first day of year', () => {
      const date = parser.parse('01/01/2024');
      expect(date.getDate()).toBe(1);
      expect(date.getMonth()).toBe(0);
    });

    test('should handle last day of year', () => {
      const date = parser.parse('31/12/2024');
      expect(date.getDate()).toBe(31);
      expect(date.getMonth()).toBe(11);
    });

    test('should handle month boundaries correctly', () => {
      expect(parser.parse('30/04/2024').getMonth()).toBe(3); // April has 30 days
      expect(() => parser.parse('31/04/2024')).toThrow(); // April doesn't have 31
    });

    test('should parse all valid months', () => {
      for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        const date = parser.parse(`15/${monthStr}/2024`);
        expect(date.getMonth()).toBe(month - 1);
      }
    });
  });
});
