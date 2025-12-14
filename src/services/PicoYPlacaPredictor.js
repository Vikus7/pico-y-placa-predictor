const LicensePlate = require('../models/LicensePlate');
const PicoYPlacaRule = require('../models/PicoYPlacaRule');
const LicensePlateValidator = require('../validators/LicensePlateValidator');
const DateValidator = require('../validators/DateValidator');
const TimeValidator = require('../validators/TimeValidator');
const DateParser = require('../parsers/DateParser');
const TimeParser = require('../parsers/TimeParser');

/**
 * Main service for predicting if a vehicle can circulate based on Pico y Placa rules
 */
class PicoYPlacaPredictor {
  /**
   * Creates a PicoYPlacaPredictor instance
   * @param {PicoYPlacaRule} rule - Optional custom rule (defaults to Quito rules)
   */
  constructor(rule = null) {
    this.picoYPlacaRule = rule || new PicoYPlacaRule();
    this.plateValidator = new LicensePlateValidator();
    this.dateValidator = new DateValidator();
    this.timeValidator = new TimeValidator();
    this.dateParser = new DateParser();
    this.timeParser = new TimeParser();
  }

  /**
   * Determines if a vehicle can circulate on the road
   * @param {string} plateNumber - License plate number
   * @param {string} dateString - Date in DD/MM/YYYY or DD-MM-YYYY format
   * @param {string} timeString - Time in HH:MM 24-hour format
   * @returns {boolean} - True if can drive, false if restricted
   */
  canDrive(plateNumber, dateString, timeString) {
    const result = this.predict(plateNumber, dateString, timeString);
    return result.canDrive;
  }

  /**
   * Predicts vehicle circulation with detailed information
   * @param {string} plateNumber - License plate number
   * @param {string} dateString - Date in DD/MM/YYYY or DD-MM-YYYY format
   * @param {string} timeString - Time in HH:MM 24-hour format
   * @returns {Object} - Detailed prediction result
   */
  predict(plateNumber, dateString, timeString) {
    // Validate all inputs
    this.validateInputs(plateNumber, dateString, timeString);

    // Parse and extract necessary information
    const plate = new LicensePlate(plateNumber);
    const dayOfWeek = this.dateParser.getDayOfWeek(dateString);
    const normalizedTime = this.timeParser.normalize(timeString);

    // Check if restricted
    const isRestricted = this.picoYPlacaRule.isRestricted(
      plate.getLastDigit(),
      dayOfWeek,
      normalizedTime
    );

    // Build result object
    return {
      plateNumber: plate.getPlateNumber(),
      lastDigit: plate.getLastDigit(),
      date: dateString,
      time: normalizedTime,
      dayOfWeek: this.getDayName(dayOfWeek),
      canDrive: !isRestricted,
      reason: this.getReason(isRestricted, dayOfWeek, normalizedTime)
    };
  }

  /**
   * Validates all inputs
   * @param {string} plateNumber - License plate number
   * @param {string} dateString - Date string
   * @param {string} timeString - Time string
   * @throws {Error} - If any input is invalid
   * @private
   */
  validateInputs(plateNumber, dateString, timeString) {
    // Validate plate
    const plateError = this.plateValidator.getValidationError(plateNumber);
    if (plateError) {
      throw new Error(plateError);
    }

    // Validate date
    const dateError = this.dateValidator.getValidationError(dateString);
    if (dateError) {
      throw new Error(dateError);
    }

    // Validate time
    const timeError = this.timeValidator.getValidationError(timeString);
    if (timeError) {
      throw new Error(timeError);
    }
  }

  /**
   * Gets the day name from day number
   * @param {number} dayOfWeek - Day number (0=Sunday, 1=Monday, ..., 6=Saturday)
   * @returns {string} - Day name
   * @private
   */
  getDayName(dayOfWeek) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  }

  /**
   * Gets the reason for the prediction result
   * @param {boolean} isRestricted - Whether the vehicle is restricted
   * @param {number} dayOfWeek - Day of week
   * @param {string} time - Time string
   * @returns {string} - Reason message
   * @private
   */
  getReason(isRestricted, dayOfWeek, time) {
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 'No Pico y Placa restrictions on weekends';
    }

    if (!isRestricted) {
      const restrictedDigits = this.picoYPlacaRule.getRestrictedDigits(dayOfWeek);
      if (restrictedDigits && restrictedDigits.length > 0) {
        if (!this.picoYPlacaRule.isWithinRestrictedHours(time)) {
          return 'Outside restricted hours (07:00-09:30, 16:00-19:30)';
        }
        return `Vehicle digit not restricted on ${this.getDayName(dayOfWeek)}`;
      }
    }

    return 'Vehicle is restricted by Pico y Placa';
  }
}

module.exports = PicoYPlacaPredictor;
