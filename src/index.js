const CommandLineInterface = require('./cli/CommandLineInterface');

/**
 * Main entry point for the Pico y Placa Predictor application
 */
function main() {
  // Get command line arguments (skip first 2: node and script path)
  const args = process.argv.slice(2);
  
  // Create and run CLI
  const cli = new CommandLineInterface();
  cli.run(args);
}

// Run the application
main();
