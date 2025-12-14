/**
 * Validates date strings in DD/MM/YYYY or DD-MM-YYYY format
 */
class DateValidator {
  constructor() {
    // Matches DD/MM/YYYY or DD-MM-YYYY
    this.pattern = /^(\d{2})[/-](\d{2})[/-](\d{4})$/;
  }

  /**
   * Validates if a date string matches the expected format and is a valid date
   * @param {string} dateString - The date string to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  validate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return false;
    }

    const trimmed = dateString.trim();
    const match = this.pattern.exec(trimmed);

    if (!match) {
      return false;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Validate ranges
    if (month < 1 || month > 12) {
      return false;
    }

    if (day < 1 || day > 31) {
      return false;
    }

    // Check if the date is actually valid (e.g., no 31/02/2024)
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  /**
   * Gets a validation error message if the date is invalid
   * @param {string} dateString - The date string to validate
   * @returns {string|null} - Error message or null if valid
   */
  getValidationError(dateString) {
    if (typeof dateString !== 'string') {
      return 'Date is required and must be a string';
    }

    const trimmed = dateString.trim();

    if (trimmed.length === 0) {
      return 'Date cannot be empty';
    }

    const match = this.pattern.exec(trimmed);

    if (!match) {
      return 'Date must be in format DD/MM/YYYY or DD-MM-YYYY (e.g., 15/03/2024 or 15-03-2024)';
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    if (month < 1 || month > 12) {
      return 'Month must be between 01 and 12';
    }

    if (day < 1 || day > 31) {
      return 'Day must be between 01 and 31';
    }

    // Check if the date is actually valid
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return `Invalid date: ${trimmed} does not exist in the calendar`;
    }

    return null;
  }
}

module.exports = DateValidator;
