const readline = require('readline');
const PicoYPlacaPredictor = require('../services/PicoYPlacaPredictor');

/**
 * Command Line Interface for Pico y Placa Predictor
 */
class CommandLineInterface {
  /**
   * Creates a CLI instance
   * @param {PicoYPlacaPredictor} predictor - Optional predictor instance
   */
  constructor(predictor = null) {
    this.predictor = predictor || new PicoYPlacaPredictor();
    this.readline = null;
  }

  /**
   * Main entry point for the CLI
   * @param {string[]} args - Command line arguments (excluding node and script path)
   */
  run(args = []) {
    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
      this.displayHelp();
      return;
    }

    // If arguments provided, run with arguments
    if (args.length >= 3) {
      this.runWithArguments(args);
    } else if (args.length === 0) {
      // No arguments, run interactive mode
      this.runInteractiveMode();
    } else {
      console.log('Error: Invalid number of arguments.');
      console.log('Run with --help for usage information.\n');
      this.displayHelp();
    }
  }

  /**
   * Runs the predictor with command line arguments
   * @param {string[]} args - [plateNumber, date, time]
   */
  runWithArguments(args) {
    const [plateNumber, date, time] = args;

    try {
      const result = this.predictor.predict(plateNumber, date, time);
      this.displayResult(result);
    } catch (error) {
      this.handleError(error);
      process.exit(1);
    }
  }

  /**
   * Runs the interactive mode
   */
  runInteractiveMode() {
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║        Pico y Placa Predictor - Interactive Mode          ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    this.promptForPlate();
  }

  /**
   * Prompts user for license plate
   * @private
   */
  promptForPlate() {
    this.readline.question('Enter license plate (e.g., ABC-1234): ', (plate) => {
      if (plate.toLowerCase() === 'exit' || plate.toLowerCase() === 'quit') {
        console.log('\nGoodbye!\n');
        this.readline.close();
        return;
      }

      this.promptForDate(plate);
    });
  }

  /**
   * Prompts user for date
   * @param {string} plate - License plate
   * @private
   */
  promptForDate(plate) {
    this.readline.question('Enter date (DD/MM/YYYY or DD-MM-YYYY): ', (date) => {
      this.promptForTime(plate, date);
    });
  }

  /**
   * Prompts user for time
   * @param {string} plate - License plate
   * @param {string} date - Date string
   * @private
   */
  promptForTime(plate, date) {
    this.readline.question('Enter time (HH:MM in 24-hour format): ', (time) => {
      try {
        const result = this.predictor.predict(plate, date, time);
        console.log('');
        this.displayResult(result);
        console.log('');
        this.promptContinue();
      } catch (error) {
        console.log('');
        this.handleError(error);
        console.log('');
        this.promptContinue();
      }
    });
  }

  /**
   * Prompts user to continue or exit
   * @private
   */
  promptContinue() {
    this.readline.question('Check another vehicle? (yes/no): ', (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('');
        this.promptForPlate();
      } else {
        console.log('\nGoodbye!\n');
        this.readline.close();
      }
    });
  }

  /**
   * Displays the prediction result
   * @param {Object} result - Prediction result
   */
  displayResult(result) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    PREDICTION RESULT                      ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`License Plate:  ${result.plateNumber}`);
    console.log(`Last Digit:     ${result.lastDigit}`);
    console.log(`Date:           ${result.date}`);
    console.log(`Day:            ${result.dayOfWeek}`);
    console.log(`Time:           ${result.time}`);
    console.log('───────────────────────────────────────────────────────────');
    
    if (result.canDrive) {
      console.log('✓ STATUS:       CAN DRIVE');
      console.log('  The vehicle is allowed on the road.');
    } else {
      console.log('✗ STATUS:       CANNOT DRIVE');
      console.log('  The vehicle is RESTRICTED by Pico y Placa.');
    }
    
    console.log('───────────────────────────────────────────────────────────');
    console.log(`Reason:         ${result.reason}`);
    console.log('═══════════════════════════════════════════════════════════\n');
  }

  /**
   * Handles and displays errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                         ERROR                             ');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`✗ ${error.message}`);
    console.log('═══════════════════════════════════════════════════════════');
  }

  /**
   * Displays help information
   */
  displayHelp() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║            Pico y Placa Predictor - Help                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log('DESCRIPTION:');
    console.log('  Predicts if a vehicle can circulate based on Quito\'s');
    console.log('  Pico y Placa restrictions.\n');
    console.log('USAGE:');
    console.log('  Interactive Mode:');
    console.log('    node src/index.js\n');
    console.log('  Command Line Mode:');
    console.log('    node src/index.js <plate> <date> <time>\n');
    console.log('ARGUMENTS:');
    console.log('  <plate>    License plate (e.g., ABC-1234, PBX-5678)');
    console.log('  <date>     Date in DD/MM/YYYY or DD-MM-YYYY format');
    console.log('  <time>     Time in HH:MM 24-hour format\n');
    console.log('EXAMPLES:');
    console.log('  node src/index.js ABC-1234 15/03/2024 08:30');
    console.log('  node src/index.js PBX-5678 20-03-2024 17:00\n');
    console.log('RESTRICTIONS:');
    console.log('  Monday:    Digits 1, 2');
    console.log('  Tuesday:   Digits 3, 4');
    console.log('  Wednesday: Digits 5, 6');
    console.log('  Thursday:  Digits 7, 8');
    console.log('  Friday:    Digits 9, 0');
    console.log('  Weekend:   No restrictions\n');
    console.log('  Restricted Hours: 07:00-09:30, 16:00-19:30\n');
    console.log('OPTIONS:');
    console.log('  --help, -h    Show this help message\n');
  }
}

module.exports = CommandLineInterface;
