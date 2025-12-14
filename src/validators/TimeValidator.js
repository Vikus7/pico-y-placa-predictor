/**
 * Validates time strings in HH:MM 24-hour format
 */
class TimeValidator {
  constructor() {
    // Matches HH:MM in 24-hour format
    this.pattern = /^([01]?\d|2[0-3]):([0-5]\d)$/;
  }

  /**
   * Validates if a time string matches the expected format
   * @param {string} timeString - The time string to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  validate(timeString) {
    if (!timeString || typeof timeString !== 'string') {
      return false;
    }

    const trimmed = timeString.trim();
    return this.pattern.test(trimmed);
  }

  /**
   * Gets a validation error message if the time is invalid
   * @param {string} timeString - The time string to validate
   * @returns {string|null} - Error message or null if valid
   */
  getValidationError(timeString) {
    if (typeof timeString !== 'string') {
      return 'Time is required and must be a string';
    }

    const trimmed = timeString.trim();

    if (trimmed.length === 0) {
      return 'Time cannot be empty';
    }

    if (!this.pattern.test(trimmed)) {
      return 'Time must be in 24-hour format HH:MM (e.g., 08:30, 17:00)';
    }

    return null;
  }
}

module.exports = TimeValidator;
