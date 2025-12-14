/**
 * Encapsulates the Pico y Placa restriction rules for Quito, Ecuador
 */
class PicoYPlacaRule {
  constructor() {
    // Map day of week (0=Sunday, 1=Monday, ..., 6=Saturday) to restricted digits
    this.restrictionMap = new Map();
    this.initializeRestrictions();

    // Restricted time windows (24-hour format)
    this.morningStart = '07:00';
    this.morningEnd = '09:30';
    this.afternoonStart = '16:00';
    this.afternoonEnd = '19:30';
  }

  /**
   * Initialize the restriction rules
   * @private
   */
  initializeRestrictions() {
    this.restrictionMap.set(1, [1, 2]); // Monday
    this.restrictionMap.set(2, [3, 4]); // Tuesday
    this.restrictionMap.set(3, [5, 6]); // Wednesday
    this.restrictionMap.set(4, [7, 8]); // Thursday
    this.restrictionMap.set(5, [9, 0]); // Friday
    // Saturday (6) and Sunday (0) have no restrictions
  }

  /**
   * Checks if a vehicle is restricted based on its last digit, day, and time
   * @param {number} lastDigit - Last digit of the license plate (0-9)
   * @param {number} dayOfWeek - Day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
   * @param {string} time - Time in HH:MM format
   * @returns {boolean} - True if restricted, false if can circulate
   */
  isRestricted(lastDigit, dayOfWeek, time) {
    // Check if the day has restrictions
    const restrictedDigits = this.getRestrictedDigits(dayOfWeek);
    
    if (!restrictedDigits || restrictedDigits.length === 0) {
      return false; // No restrictions on this day
    }

    // Check if the digit is restricted on this day
    if (!restrictedDigits.includes(lastDigit)) {
      return false; // This digit is not restricted today
    }

    // Check if current time is within restricted hours
    return this.isWithinRestrictedHours(time);
  }

  /**
   * Gets the restricted digits for a specific day
   * @param {number} dayOfWeek - Day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
   * @returns {number[]|null} - Array of restricted digits or null if no restrictions
   */
  getRestrictedDigits(dayOfWeek) {
    return this.restrictionMap.get(dayOfWeek) || null;
  }

  /**
   * Checks if a time falls within the restricted hours
   * @param {string} time - Time in HH:MM format
   * @returns {boolean} - True if within restricted hours
   */
  isWithinRestrictedHours(time) {
    const timeMinutes = this.timeToMinutes(time);
    const morningStartMinutes = this.timeToMinutes(this.morningStart);
    const morningEndMinutes = this.timeToMinutes(this.morningEnd);
    const afternoonStartMinutes = this.timeToMinutes(this.afternoonStart);
    const afternoonEndMinutes = this.timeToMinutes(this.afternoonEnd);

    // Check if time is in morning restriction window
    const inMorningWindow = timeMinutes >= morningStartMinutes && timeMinutes <= morningEndMinutes;
    
    // Check if time is in afternoon restriction window
    const inAfternoonWindow = timeMinutes >= afternoonStartMinutes && timeMinutes <= afternoonEndMinutes;

    return inMorningWindow || inAfternoonWindow;
  }

  /**
   * Converts time string to minutes since midnight
   * @param {string} time - Time in HH:MM format
   * @returns {number} - Minutes since midnight
   * @private
   */
  timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

module.exports = PicoYPlacaRule;
