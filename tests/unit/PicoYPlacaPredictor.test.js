const PicoYPlacaPredictor = require('../../src/services/PicoYPlacaPredictor');

describe('PicoYPlacaPredictor', () => {
  let predictor;

  beforeEach(() => {
    predictor = new PicoYPlacaPredictor();
  });

  describe('constructor', () => {
    test('should create predictor with default rule', () => {
      expect(predictor).toBeDefined();
      expect(predictor.picoYPlacaRule).toBeDefined();
    });

    test('should create predictor with custom rule', () => {
      const customRule = { isRestricted: () => false };
      const customPredictor = new PicoYPlacaPredictor(customRule);
      expect(customPredictor.picoYPlacaRule).toBe(customRule);
    });
  });

  describe('canDrive()', () => {
    test('should return true when vehicle can drive', () => {
      // Plate ending in 4, Monday at 08:00 (restricted digits are 1,2)
      expect(predictor.canDrive('PBX-1234', '18/03/2024', '08:00')).toBe(true);
    });

    test('should return false when vehicle is restricted', () => {
      // Plate ending in 1, Monday at 08:00 (restricted digits are 1,2)
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '08:00')).toBe(false);
    });

    test('should return true outside restricted hours', () => {
      // Plate ending in 1, Monday at 10:00 (outside restricted hours)
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '10:00')).toBe(true);
    });

    test('should return true on weekends', () => {
      // Saturday
      expect(predictor.canDrive('ABC-1231', '16/03/2024', '08:00')).toBe(true);
      // Sunday
      expect(predictor.canDrive('ABC-1231', '17/03/2024', '08:00')).toBe(true);
    });
  });

  describe('predict()', () => {
    test('should return detailed prediction for allowed vehicle', () => {
      const result = predictor.predict('PBX-1234', '18/03/2024', '08:00');
      
      expect(result).toHaveProperty('plateNumber', 'PBX-1234');
      expect(result).toHaveProperty('lastDigit', 4);
      expect(result).toHaveProperty('date', '18/03/2024');
      expect(result).toHaveProperty('time', '08:00');
      expect(result).toHaveProperty('dayOfWeek', 'Monday');
      expect(result).toHaveProperty('canDrive', true);
      expect(result).toHaveProperty('reason');
    });

    test('should return detailed prediction for restricted vehicle', () => {
      const result = predictor.predict('ABC-1231', '18/03/2024', '08:00');
      
      expect(result.plateNumber).toBe('ABC-1231');
      expect(result.lastDigit).toBe(1);
      expect(result.dayOfWeek).toBe('Monday');
      expect(result.canDrive).toBe(false);
      expect(result.reason).toContain('restricted');
    });

    test('should handle different date formats', () => {
      const result1 = predictor.predict('ABC-1234', '18/03/2024', '08:00');
      const result2 = predictor.predict('ABC-1234', '18-03-2024', '08:00');
      
      expect(result1.canDrive).toBe(result2.canDrive);
    });

    test('should handle single digit hours', () => {
      const result = predictor.predict('ABC-1234', '18/03/2024', '8:00');
      expect(result.time).toBe('08:00'); // Normalized
    });

    test('should identify weekend correctly', () => {
      const saturdayResult = predictor.predict('ABC-1231', '16/03/2024', '08:00');
      expect(saturdayResult.canDrive).toBe(true);
      expect(saturdayResult.reason).toContain('weekend');

      const sundayResult = predictor.predict('ABC-1231', '17/03/2024', '08:00');
      expect(sundayResult.canDrive).toBe(true);
      expect(sundayResult.reason).toContain('weekend');
    });

    test('should handle all use case scenarios', () => {
      // Scenario 1: Plate PBX-1234, Monday at 8:00 AM
      const scenario1 = predictor.predict('PBX-1234', '18/03/2024', '08:00');
      expect(scenario1.canDrive).toBe(true);
      expect(scenario1.lastDigit).toBe(4);

      // Scenario 2: Plate ABC-5678, Wednesday at 17:00
      const scenario2 = predictor.predict('ABC-5678', '20/03/2024', '17:00');
      expect(scenario2.canDrive).toBe(true);
      expect(scenario2.lastDigit).toBe(8);

      // Scenario 3: Plate XYZ-9990, Friday at 07:15
      const scenario3 = predictor.predict('XYZ-9990', '22/03/2024', '07:15');
      expect(scenario3.canDrive).toBe(false);
      expect(scenario3.lastDigit).toBe(0);

      // Scenario 4: Plate DEF-1111, Monday at 10:00
      const scenario4 = predictor.predict('DEF-1111', '18/03/2024', '10:00');
      expect(scenario4.canDrive).toBe(true);
      expect(scenario4.lastDigit).toBe(1);
    });
  });

  describe('validateInputs()', () => {
    test('should throw error for invalid plate', () => {
      expect(() => predictor.predict('INVALID', '18/03/2024', '08:00')).toThrow();
      expect(() => predictor.predict('123', '18/03/2024', '08:00')).toThrow('License plate');
    });

    test('should throw error for invalid date', () => {
      expect(() => predictor.predict('ABC-1234', '2024-03-18', '08:00')).toThrow();
      expect(() => predictor.predict('ABC-1234', '32/03/2024', '08:00')).toThrow();
    });

    test('should throw error for invalid time', () => {
      expect(() => predictor.predict('ABC-1234', '18/03/2024', '25:00')).toThrow();
      expect(() => predictor.predict('ABC-1234', '18/03/2024', '08:60')).toThrow();
      expect(() => predictor.predict('ABC-1234', '18/03/2024', '8:30 AM')).toThrow();
    });

    test('should throw error for null or undefined inputs', () => {
      expect(() => predictor.predict(null, '18/03/2024', '08:00')).toThrow();
      expect(() => predictor.predict('ABC-1234', null, '08:00')).toThrow();
      expect(() => predictor.predict('ABC-1234', '18/03/2024', null)).toThrow();
    });

    test('should throw error for empty strings', () => {
      expect(() => predictor.predict('', '18/03/2024', '08:00')).toThrow();
      expect(() => predictor.predict('ABC-1234', '', '08:00')).toThrow();
      expect(() => predictor.predict('ABC-1234', '18/03/2024', '')).toThrow();
    });
  });

  describe('comprehensive restriction tests', () => {
    test('should restrict all Monday digits correctly', () => {
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '08:00')).toBe(false); // Digit 1
      expect(predictor.canDrive('ABC-1232', '18/03/2024', '08:00')).toBe(false); // Digit 2
      expect(predictor.canDrive('ABC-1233', '18/03/2024', '08:00')).toBe(true);  // Digit 3
    });

    test('should restrict all Tuesday digits correctly', () => {
      expect(predictor.canDrive('ABC-1233', '19/03/2024', '08:00')).toBe(false); // Digit 3
      expect(predictor.canDrive('ABC-1234', '19/03/2024', '08:00')).toBe(false); // Digit 4
      expect(predictor.canDrive('ABC-1235', '19/03/2024', '08:00')).toBe(true);  // Digit 5
    });

    test('should restrict all Wednesday digits correctly', () => {
      expect(predictor.canDrive('ABC-1235', '20/03/2024', '08:00')).toBe(false); // Digit 5
      expect(predictor.canDrive('ABC-1236', '20/03/2024', '08:00')).toBe(false); // Digit 6
      expect(predictor.canDrive('ABC-1237', '20/03/2024', '08:00')).toBe(true);  // Digit 7
    });

    test('should restrict all Thursday digits correctly', () => {
      expect(predictor.canDrive('ABC-1237', '21/03/2024', '08:00')).toBe(false); // Digit 7
      expect(predictor.canDrive('ABC-1238', '21/03/2024', '08:00')).toBe(false); // Digit 8
      expect(predictor.canDrive('ABC-1239', '21/03/2024', '08:00')).toBe(true);  // Digit 9
    });

    test('should restrict all Friday digits correctly', () => {
      expect(predictor.canDrive('ABC-1239', '22/03/2024', '08:00')).toBe(false); // Digit 9
      expect(predictor.canDrive('ABC-1230', '22/03/2024', '08:00')).toBe(false); // Digit 0
      expect(predictor.canDrive('ABC-1231', '22/03/2024', '08:00')).toBe(true);  // Digit 1
    });

    test('should respect morning restriction window', () => {
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '06:59')).toBe(true);  // Before
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '07:00')).toBe(false); // Start
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '08:00')).toBe(false); // Middle
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '09:30')).toBe(false); // End
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '09:31')).toBe(true);  // After
    });

    test('should respect afternoon restriction window', () => {
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '15:59')).toBe(true);  // Before
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '16:00')).toBe(false); // Start
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '17:00')).toBe(false); // Middle
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '19:30')).toBe(false); // End
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '19:31')).toBe(true);  // After
    });

    test('should handle noon and midnight correctly', () => {
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '00:00')).toBe(true); // Midnight
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '12:00')).toBe(true); // Noon
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '23:59')).toBe(true); // Late night
    });
  });

  describe('edge cases', () => {
    test('should handle plates with lowercase letters', () => {
      const result = predictor.predict('abc-1234', '18/03/2024', '08:00');
      expect(result.plateNumber).toBe('ABC-1234');
    });

    test('should handle dates with extra whitespace', () => {
      const result = predictor.predict('ABC-1234', '  18/03/2024  ', '08:00');
      expect(result.canDrive).toBeDefined();
    });

    test('should handle all digits 0-9', () => {
      for (let i = 0; i <= 9; i++) {
        const result = predictor.predict(`ABC-123${i}`, '18/03/2024', '08:00');
        expect(result.lastDigit).toBe(i);
      }
    });
  });
});
