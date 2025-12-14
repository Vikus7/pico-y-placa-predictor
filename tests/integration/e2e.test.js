const PicoYPlacaPredictor = require('../../src/services/PicoYPlacaPredictor');

describe('End-to-End Integration Tests', () => {
  let predictor;

  beforeEach(() => {
    predictor = new PicoYPlacaPredictor();
  });

  describe('Real-world scenarios', () => {
    test('commuter going to work on Monday morning', () => {
      // Plate ending in 1, Monday 7:30 AM - CANNOT drive
      const result = predictor.predict('PBX-1001', '18/03/2024', '07:30');
      
      expect(result.canDrive).toBe(false);
      expect(result.lastDigit).toBe(1);
      expect(result.dayOfWeek).toBe('Monday');
      expect(result.reason).toContain('restricted');
    });

    test('commuter leaving work on Monday evening', () => {
      // Plate ending in 1, Monday 6:00 PM - CANNOT drive
      const result = predictor.predict('PBX-1001', '18/03/2024', '18:00');
      
      expect(result.canDrive).toBe(false);
      expect(result.reason).toContain('restricted');
    });

    test('commuter with unrestricted plate on Monday', () => {
      // Plate ending in 5, Monday 8:00 AM - CAN drive
      const result = predictor.predict('ABC-5555', '18/03/2024', '08:00');
      
      expect(result.canDrive).toBe(true);
      expect(result.lastDigit).toBe(5);
      expect(result.reason).not.toContain('restricted by');
    });

    test('late night trip after restrictions', () => {
      // Plate ending in 1, Monday 10:00 PM - CAN drive
      const result = predictor.predict('PBX-1001', '18/03/2024', '22:00');
      
      expect(result.canDrive).toBe(true);
      expect(result.reason).toContain('Outside restricted hours');
    });

    test('weekend shopping trip', () => {
      // Plate ending in 1, Saturday 10:00 AM - CAN drive
      const result = predictor.predict('PBX-1001', '16/03/2024', '10:00');
      
      expect(result.canDrive).toBe(true);
      expect(result.dayOfWeek).toBe('Saturday');
      expect(result.reason).toContain('weekend');
    });

    test('early morning before restrictions', () => {
      // Plate ending in 1, Monday 6:00 AM - CAN drive
      const result = predictor.predict('PBX-1001', '18/03/2024', '06:00');
      
      expect(result.canDrive).toBe(true);
      expect(result.reason).toContain('Outside restricted hours');
    });

    test('between restriction windows', () => {
      // Plate ending in 1, Monday 12:00 PM - CAN drive
      const result = predictor.predict('PBX-1001', '18/03/2024', '12:00');
      
      expect(result.canDrive).toBe(true);
      expect(result.reason).toContain('Outside restricted hours');
    });
  });

  describe('Full week simulation for one vehicle', () => {
    const plateNumber = 'PBX-1234'; // Ends in 4, restricted on Tuesday

    test('should allow Monday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '08:00')).toBe(true);
    });

    test('should restrict Tuesday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '19/03/2024', '08:00')).toBe(false);
    });

    test('should allow Wednesday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '20/03/2024', '08:00')).toBe(true);
    });

    test('should allow Thursday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '21/03/2024', '08:00')).toBe(true);
    });

    test('should allow Friday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '22/03/2024', '08:00')).toBe(true);
    });

    test('should allow Saturday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '23/03/2024', '08:00')).toBe(true);
    });

    test('should allow Sunday at 8 AM', () => {
      expect(predictor.canDrive(plateNumber, '24/03/2024', '08:00')).toBe(true);
    });
  });

  describe('Boundary time testing', () => {
    const plateNumber = 'ABC-1231'; // Restricted on Monday

    test('exactly at morning restriction start', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '07:00')).toBe(false);
    });

    test('exactly at morning restriction end', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '09:30')).toBe(false);
    });

    test('one minute before morning restriction', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '06:59')).toBe(true);
    });

    test('one minute after morning restriction', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '09:31')).toBe(true);
    });

    test('exactly at afternoon restriction start', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '16:00')).toBe(false);
    });

    test('exactly at afternoon restriction end', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '19:30')).toBe(false);
    });

    test('one minute before afternoon restriction', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '15:59')).toBe(true);
    });

    test('one minute after afternoon restriction', () => {
      expect(predictor.canDrive(plateNumber, '18/03/2024', '19:31')).toBe(true);
    });
  });

  describe('All digits on their respective restriction days', () => {
    test('digits 1 and 2 on Monday', () => {
      expect(predictor.canDrive('ABC-1231', '18/03/2024', '08:00')).toBe(false);
      expect(predictor.canDrive('ABC-1232', '18/03/2024', '08:00')).toBe(false);
    });

    test('digits 3 and 4 on Tuesday', () => {
      expect(predictor.canDrive('ABC-1233', '19/03/2024', '08:00')).toBe(false);
      expect(predictor.canDrive('ABC-1234', '19/03/2024', '08:00')).toBe(false);
    });

    test('digits 5 and 6 on Wednesday', () => {
      expect(predictor.canDrive('ABC-1235', '20/03/2024', '08:00')).toBe(false);
      expect(predictor.canDrive('ABC-1236', '20/03/2024', '08:00')).toBe(false);
    });

    test('digits 7 and 8 on Thursday', () => {
      expect(predictor.canDrive('ABC-1237', '21/03/2024', '08:00')).toBe(false);
      expect(predictor.canDrive('ABC-1238', '21/03/2024', '08:00')).toBe(false);
    });

    test('digits 9 and 0 on Friday', () => {
      expect(predictor.canDrive('ABC-1239', '22/03/2024', '08:00')).toBe(false);
      expect(predictor.canDrive('ABC-1230', '22/03/2024', '08:00')).toBe(false);
    });
  });

  describe('Different input formats', () => {
    test('should handle date with slashes', () => {
      const result1 = predictor.canDrive('ABC-1234', '19/03/2024', '08:00');
      expect(result1).toBe(false);
    });

    test('should handle date with hyphens', () => {
      const result2 = predictor.canDrive('ABC-1234', '19-03-2024', '08:00');
      expect(result2).toBe(false);
    });

    test('should handle time with single digit hour', () => {
      const result1 = predictor.canDrive('ABC-1234', '19/03/2024', '8:00');
      const result2 = predictor.canDrive('ABC-1234', '19/03/2024', '08:00');
      expect(result1).toBe(result2);
    });

    test('should handle lowercase plate letters', () => {
      const result1 = predictor.canDrive('abc-1234', '19/03/2024', '08:00');
      const result2 = predictor.canDrive('ABC-1234', '19/03/2024', '08:00');
      expect(result1).toBe(result2);
    });

    test('should handle mixed case plates', () => {
      const result = predictor.predict('AbC-1234', '19/03/2024', '08:00');
      expect(result.plateNumber).toBe('ABC-1234');
    });
  });

  describe('Error handling in integration', () => {
    test('should reject completely invalid inputs', () => {
      expect(() => predictor.predict('invalid', 'invalid', 'invalid')).toThrow();
    });

    test('should reject valid plate with invalid date', () => {
      expect(() => predictor.predict('ABC-1234', '32/13/2024', '08:00')).toThrow();
    });

    test('should reject valid inputs with invalid time', () => {
      expect(() => predictor.predict('ABC-1234', '19/03/2024', '25:99')).toThrow();
    });

    test('should provide meaningful error messages', () => {
      try {
        predictor.predict('INVALID', '19/03/2024', '08:00');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('License plate');
      }
    });
  });

  describe('Performance and consistency', () => {
    test('should return consistent results for same inputs', () => {
      const result1 = predictor.predict('ABC-1234', '19/03/2024', '08:00');
      const result2 = predictor.predict('ABC-1234', '19/03/2024', '08:00');
      const result3 = predictor.predict('ABC-1234', '19/03/2024', '08:00');
      
      expect(result1.canDrive).toBe(result2.canDrive);
      expect(result2.canDrive).toBe(result3.canDrive);
    });

    test('should handle multiple predictions in sequence', () => {
      const predictions = [];
      
      for (let i = 1; i <= 9; i++) {
        predictions.push(predictor.predict(`ABC-123${i}`, '18/03/2024', '08:00'));
      }
      
      expect(predictions).toHaveLength(9);
      predictions.forEach(p => expect(p).toHaveProperty('canDrive'));
    });
  });
});
