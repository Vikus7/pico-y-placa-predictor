/**
 * Validates Ecuadorian license plate numbers
 */
class LicensePlateValidator {
  constructor() {
    // Ecuadorian format: 3 letters - 4 digits (e.g., ABC-1234, PBX-5678)
    this.pattern = /^[A-Z]{3}-\d{4}$/;
  }

  /**
   * Validates if a license plate number matches the expected format
   * @param {string} plateNumber - The license plate to validate
   * @returns {boolean} - True if valid, false otherwise
   */
  validate(plateNumber) {
    if (!plateNumber || typeof plateNumber !== 'string') {
      return false;
    }

    // Convert to uppercase for validation
    const normalized = plateNumber.trim().toUpperCase();
    return this.pattern.test(normalized);
  }

  /**
   * Gets a validation error message if the plate is invalid
   * @param {string} plateNumber - The license plate to validate
   * @returns {string|null} - Error message or null if valid
   */
  getValidationError(plateNumber) {
    if (typeof plateNumber !== 'string') {
      return 'License plate is required and must be a string';
    }

    const trimmed = plateNumber.trim();
    
    if (trimmed.length === 0) {
      return 'License plate cannot be empty';
    }

    const normalized = trimmed.toUpperCase();
    
    if (!this.pattern.test(normalized)) {
      return 'License plate must follow the format: ABC-1234 (3 letters, hyphen, 4 digits)';
    }

    return null;
  }
}

module.exports = LicensePlateValidator;
