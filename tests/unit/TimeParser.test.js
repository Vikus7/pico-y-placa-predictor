const TimeParser = require('../../src/parsers/TimeParser');

describe('TimeParser', () => {
  let parser;

  beforeEach(() => {
    parser = new TimeParser();
  });

  describe('parse()', () => {
    test('should parse time with double digits', () => {
      const time = parser.parse('08:30');
      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(30);
    });

    test('should parse time with single digit hour', () => {
      const time = parser.parse('8:30');
      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(30);
    });

    test('should parse midnight', () => {
      const time = parser.parse('00:00');
      expect(time.hours).toBe(0);
      expect(time.minutes).toBe(0);
    });

    test('should parse noon', () => {
      const time = parser.parse('12:00');
      expect(time.hours).toBe(12);
      expect(time.minutes).toBe(0);
    });

    test('should parse end of day', () => {
      const time = parser.parse('23:59');
      expect(time.hours).toBe(23);
      expect(time.minutes).toBe(59);
    });

    test('should parse times with extra whitespace', () => {
      const time = parser.parse('  08:30  ');
      expect(time.hours).toBe(8);
      expect(time.minutes).toBe(30);
    });

    test('should throw error for invalid format', () => {
      expect(() => parser.parse('8:30 AM')).toThrow('Invalid time format');
      expect(() => parser.parse('08-30')).toThrow('Invalid time format');
      expect(() => parser.parse('8:3')).toThrow('Invalid time format');
      expect(() => parser.parse('invalid')).toThrow('Invalid time format');
    });

    test('should throw error for invalid hours', () => {
      expect(() => parser.parse('24:00')).toThrow('Invalid time format');
      expect(() => parser.parse('25:30')).toThrow('Invalid time format');
    });

    test('should throw error for invalid minutes', () => {
      expect(() => parser.parse('08:60')).toThrow('Invalid time format');
      expect(() => parser.parse('08:99')).toThrow('Invalid time format');
    });

    test('should throw error for null or undefined', () => {
      expect(() => parser.parse(null)).toThrow('Time string is required');
      expect(() => parser.parse(undefined)).toThrow('Time string is required');
    });

    test('should throw error for empty string', () => {
      expect(() => parser.parse('')).toThrow('Time string is required');
    });
  });

  describe('toMinutes()', () => {
    test('should convert midnight to 0 minutes', () => {
      expect(parser.toMinutes('00:00')).toBe(0);
    });

    test('should convert times to minutes correctly', () => {
      expect(parser.toMinutes('01:00')).toBe(60);
      expect(parser.toMinutes('08:30')).toBe(510);
      expect(parser.toMinutes('12:00')).toBe(720);
      expect(parser.toMinutes('17:45')).toBe(1065);
      expect(parser.toMinutes('23:59')).toBe(1439);
    });

    test('should work with single digit hours', () => {
      expect(parser.toMinutes('8:30')).toBe(510);
      expect(parser.toMinutes('5:00')).toBe(300);
    });

    test('should handle restriction times', () => {
      expect(parser.toMinutes('07:00')).toBe(420);
      expect(parser.toMinutes('09:30')).toBe(570);
      expect(parser.toMinutes('16:00')).toBe(960);
      expect(parser.toMinutes('19:30')).toBe(1170);
    });
  });

  describe('normalize()', () => {
    test('should normalize single digit hours', () => {
      expect(parser.normalize('8:30')).toBe('08:30');
      expect(parser.normalize('9:00')).toBe('09:00');
    });

    test('should keep double digit format', () => {
      expect(parser.normalize('08:30')).toBe('08:30');
      expect(parser.normalize('17:45')).toBe('17:45');
    });

    test('should normalize minutes', () => {
      expect(parser.normalize('8:05')).toBe('08:05');
      expect(parser.normalize('12:00')).toBe('12:00');
    });

    test('should normalize midnight and noon', () => {
      expect(parser.normalize('00:00')).toBe('00:00');
      expect(parser.normalize('0:00')).toBe('00:00');
      expect(parser.normalize('12:00')).toBe('12:00');
    });
  });

  describe('compare()', () => {
    test('should return 0 for equal times', () => {
      expect(parser.compare('08:30', '08:30')).toBe(0);
      expect(parser.compare('12:00', '12:00')).toBe(0);
    });

    test('should return negative when first time is earlier', () => {
      expect(parser.compare('08:00', '09:00')).toBeLessThan(0);
      expect(parser.compare('07:00', '07:30')).toBeLessThan(0);
    });

    test('should return positive when first time is later', () => {
      expect(parser.compare('09:00', '08:00')).toBeGreaterThan(0);
      expect(parser.compare('17:30', '16:00')).toBeGreaterThan(0);
    });

    test('should work with single digit hours', () => {
      expect(parser.compare('8:30', '08:30')).toBe(0);
      expect(parser.compare('8:00', '9:00')).toBeLessThan(0);
    });
  });

  describe('isBetween()', () => {
    test('should return true for time within morning restriction', () => {
      expect(parser.isBetween('08:00', '07:00', '09:30')).toBe(true);
      expect(parser.isBetween('07:00', '07:00', '09:30')).toBe(true); // Start boundary
      expect(parser.isBetween('09:30', '07:00', '09:30')).toBe(true); // End boundary
    });

    test('should return true for time within afternoon restriction', () => {
      expect(parser.isBetween('17:00', '16:00', '19:30')).toBe(true);
      expect(parser.isBetween('16:00', '16:00', '19:30')).toBe(true); // Start boundary
      expect(parser.isBetween('19:30', '16:00', '19:30')).toBe(true); // End boundary
    });

    test('should return false for time outside range', () => {
      expect(parser.isBetween('06:59', '07:00', '09:30')).toBe(false);
      expect(parser.isBetween('09:31', '07:00', '09:30')).toBe(false);
      expect(parser.isBetween('15:59', '16:00', '19:30')).toBe(false);
      expect(parser.isBetween('19:31', '16:00', '19:30')).toBe(false);
    });

    test('should work with single digit hours', () => {
      expect(parser.isBetween('8:00', '7:00', '9:30')).toBe(true);
      expect(parser.isBetween('6:59', '7:00', '9:30')).toBe(false);
    });

    test('should handle non-restriction hours', () => {
      expect(parser.isBetween('10:00', '07:00', '09:30')).toBe(false);
      expect(parser.isBetween('12:00', '16:00', '19:30')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('should handle all hours of the day', () => {
      for (let hour = 0; hour <= 23; hour++) {
        const timeStr = `${hour}:00`;
        const time = parser.parse(timeStr);
        expect(time.hours).toBe(hour);
      }
    });

    test('should handle all minutes in an hour', () => {
      for (let minute = 0; minute <= 59; minute++) {
        const timeStr = `08:${minute.toString().padStart(2, '0')}`;
        const time = parser.parse(timeStr);
        expect(time.minutes).toBe(minute);
      }
    });

    test('should calculate minutes correctly for edge times', () => {
      expect(parser.toMinutes('00:00')).toBe(0);
      expect(parser.toMinutes('00:01')).toBe(1);
      expect(parser.toMinutes('23:58')).toBe(1438);
      expect(parser.toMinutes('23:59')).toBe(1439);
    });
  });
});
