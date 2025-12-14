/**
 * Represents an Ecuadorian license plate
 */
class LicensePlate {
  /**
   * Creates a LicensePlate instance
   * @param {string} plateNumber - The license plate number (e.g., "PBX-1234")
   */
  constructor(plateNumber) {
    if (!plateNumber || typeof plateNumber !== 'string') {
      throw new Error('License plate number is required and must be a string');
    }

    this.plateNumber = plateNumber.trim().toUpperCase();
    this.lastDigit = this.extractLastDigit();
  }

  /**
   * Extracts the last digit from the license plate number
   * @returns {number} - The last digit (0-9)
   * @private
   */
  extractLastDigit() {
    // Extract only digits from the plate
    const digits = this.plateNumber.replace(/\D/g, '');
    
    if (digits.length === 0) {
      throw new Error('License plate must contain at least one digit');
    }

    const lastChar = digits[digits.length - 1];
    return parseInt(lastChar, 10);
  }

  /**
   * Gets the full plate number
   * @returns {string} - The plate number
   */
  getPlateNumber() {
    return this.plateNumber;
  }

  /**
   * Gets the last digit of the plate
   * @returns {number} - The last digit (0-9)
   */
  getLastDigit() {
    return this.lastDigit;
  }

  /**
   * String representation of the license plate
   * @returns {string}
   */
  toString() {
    return `LicensePlate(${this.plateNumber}, last digit: ${this.lastDigit})`;
  }
}

module.exports = LicensePlate;
