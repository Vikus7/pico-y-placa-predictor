/**
 * Parses and manipulates time strings in HH:MM 24-hour format
 */
class TimeParser {
  constructor() {
    // Pattern for HH:MM in 24-hour format
    this.pattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  }

  /**
   * Parses a time string and returns an object with hours and minutes
   * @param {string} timeString - Time in HH:MM format
   * @returns {Object} - {hours: number, minutes: number}
   * @throws {Error} - If time format is invalid
   */
  parse(timeString) {
    if (!timeString || typeof timeString !== 'string') {
      throw new Error('Time string is required');
    }

    const trimmed = timeString.trim();
    const match = this.pattern.exec(trimmed);

    if (!match) {
      throw new Error('Invalid time format. Expected HH:MM in 24-hour format');
    }

    return {
      hours: parseInt(match[1], 10),
      minutes: parseInt(match[2], 10)
    };
  }

  /**
   * Converts a time string to total minutes since midnight
   * @param {string} timeString - Time in HH:MM format
   * @returns {number} - Total minutes since midnight
   */
  toMinutes(timeString) {
    const { hours, minutes } = this.parse(timeString);
    return hours * 60 + minutes;
  }

  /**
   * Normalizes a time string to HH:MM format with leading zeros
   * @param {string} timeString - Time in HH:MM or H:MM format
   * @returns {string} - Normalized time string (HH:MM)
   */
  normalize(timeString) {
    const { hours, minutes } = this.parse(timeString);
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
  }

  /**
   * Compares two time strings
   * @param {string} time1 - First time
   * @param {string} time2 - Second time
   * @returns {number} - Negative if time1 < time2, 0 if equal, positive if time1 > time2
   */
  compare(time1, time2) {
    const minutes1 = this.toMinutes(time1);
    const minutes2 = this.toMinutes(time2);
    return minutes1 - minutes2;
  }

  /**
   * Checks if a time is between two other times (inclusive)
   * @param {string} time - Time to check
   * @param {string} startTime - Start of range
   * @param {string} endTime - End of range
   * @returns {boolean} - True if time is within range
   */
  isBetween(time, startTime, endTime) {
    const timeMinutes = this.toMinutes(time);
    const startMinutes = this.toMinutes(startTime);
    const endMinutes = this.toMinutes(endTime);
    
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
  }
}

module.exports = TimeParser;
