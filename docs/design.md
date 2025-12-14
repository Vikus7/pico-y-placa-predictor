# Design Phase

## Architecture overview

After analyzing the Pico y Placa problem, I designed an object-oriented architecture that breaks down the system into focused, independent components. The main idea was to separate different responsibilities so each piece does one thing well.

## Why this architecture?

The architecture emerged naturally from asking: "What does the system need to do?" Instead of building one big class that does everything, I identified distinct responsibilities and created separate components for each.

### Component responsibilities

**Models** - Represent the real-world concepts:
- `LicensePlate`: Holds the plate number and extracts the last digit
- `PicoYPlacaRule`: Knows the restriction rules (which days, which digits, what times)

**Validators** - Check if user input is valid:
- `LicensePlateValidator`: Ensures the plate follows the ABC-1234 format
- `DateValidator`: Checks if the date is in DD/MM/YYYY format and exists in the calendar
- `TimeValidator`: Verifies the time is in HH:MM 24-hour format

**Parsers** - Transform strings into usable data:
- `DateParser`: Converts date strings to Date objects and extracts the day of the week
- `TimeParser`: Parses time strings and converts them to minutes for easy comparison

**Services** - The brain that coordinates everything:
- `PicoYPlacaPredictor`: Takes user input, validates it, parses it, applies the rules, and returns the decision

**CLI** - Talks to the user:
- `CommandLineInterface`: Handles user interaction, displays results, shows errors in a friendly way

## Design principles applied

- **Single Responsibility**: Each class has one clear job
- **Separation of Concerns**: Business logic is separate from user interface
- **Dependency Injection**: The predictor receives its dependencies, making it flexible and testable
- **Encapsulation**: Internal details are hidden, only necessary methods are exposed

## Benefits of hhis design

1. **Easy to test**: Each component can be tested independently
2. **Easy to modify**: Changing one part doesn't break others
3. **Easy to understand**: Each class has a clear purpose
4. **Reusable**: Components can be used in different contexts (CLI, web, mobile, etc.)

## Class diagram

The following diagram shows how all the components connect to each other:

![Class Diagram](pico-placa-class-diagram.png)

---

The diagram illustrates the relationships between components. The `PicoYPlacaPredictor` service acts as the orchestrator, using validators to check inputs, parsers to transform data, and models to apply business rules. The CLI sits on top, providing the user interface.
