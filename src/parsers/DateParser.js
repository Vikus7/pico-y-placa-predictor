/**
 * Parses date strings in DD/MM/YYYY or DD-MM-YYYY format
 */
class DateParser {
  constructor() {
    // Pattern for DD/MM/YYYY or DD-MM-YYYY
    this.pattern = /^(\d{2})[/-](\d{2})[/-](\d{4})$/;
  }

  /**
   * Parses a date string and returns a Date object
   * @param {string} dateString - Date in DD/MM/YYYY or DD-MM-YYYY format
   * @returns {Date} - JavaScript Date object
   * @throws {Error} - If date format is invalid
   */
  parse(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      throw new Error('Date string is required');
    }

    const trimmed = dateString.trim();
    const match = this.pattern.exec(trimmed);

    if (!match) {
      throw new Error('Invalid date format. Expected DD/MM/YYYY or DD-MM-YYYY');
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Create Date object (month is 0-indexed in JavaScript)
    const date = new Date(year, month - 1, day);

    // Validate that the date is actually valid
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error(`Invalid date: ${dateString} does not exist in the calendar`);
    }

    return date;
  }

  /**
   * Gets the day of the week from a date string
   * @param {string} dateString - Date in DD/MM/YYYY or DD-MM-YYYY format
   * @returns {number} - Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
   */
  getDayOfWeek(dateString) {
    const date = this.parse(dateString);
    return date.getDay();
  }

  /**
   * Gets a formatted string representation of the date
   * @param {string} dateString - Date in DD/MM/YYYY or DD-MM-YYYY format
   * @returns {string} - Formatted date string
   */
  format(dateString) {
    const date = this.parse(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }
}

module.exports = DateParser;
