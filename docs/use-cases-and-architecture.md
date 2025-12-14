# Use cases and Architecture analysis

## Problem Context

In Quito, Ecuador, the Pico y Placa regulation restricts vehicle circulation to reduce traffic congestion. The restriction depends on three factors:
- The **last digit** of the license plate number
- The **day of the week**
- The **time of day**

### Restriction rules

The system blocks vehicles based on their plate's last digit:

| Day       | Restricted digits |
|-----------|-------------------|
| Monday    | 1, 2              |
| Tuesday   | 3, 4              |
| Wednesday | 5, 6              |
| Thursday  | 7, 8              |
| Friday    | 9, 0              |
| Weekend   | No restrictions   |

**Restricted hours:**
- Morning: 7:00 AM - 9:30 AM
- Afternoon: 4:00 PM - 7:30 PM

Outside these time windows, all vehicles can circulate freely.

---

## Use Cases

### UC1: Check if Vehicle Can Circulate

**Actor:** Driver / User

**Description:** A user wants to know if their vehicle can be on the road at a specific date and time.

**Input:**
- License plate number (e.g., "PBX-1234")
- Date (e.g., "2024-03-15" or "15/03/2024")
- Time (e.g., "08:30" or "8:30 AM")

**Process:**
1. System receives the license plate number
2. System extracts the last digit from the plate
3. System determines what day of the week corresponds to the given date
4. System checks if that day has restrictions for that digit
5. System verifies if the time falls within restricted hours
6. System returns YES (can drive) or NO (cannot drive)

**Output:**
- Boolean result: Can drive / Cannot drive
- Reason: "Restricted by Pico y Placa" or "No restrictions apply"

**Example Scenarios:**

**Scenario 1:** Plate PBX-1234, Monday at 8:00 AM
- Last digit: 4
- Day: Monday (restricted digits: 1, 2)
- Time: 8:00 AM (within restricted hours)
- Result: **CAN DRIVE** (digit 4 is not restricted on Monday)

**Scenario 2:** Plate ABC-5678, Wednesday at 5:00 PM
- Last digit: 8
- Day: Wednesday (restricted digits: 5, 6)
- Time: 5:00 PM (within restricted hours)
- Result: **CAN DRIVE** (digit 8 is not restricted on Wednesday)

**Scenario 3:** Plate XYZ-9990, Friday at 7:15 AM
- Last digit: 0
- Day: Friday (restricted digits: 9, 0)
- Time: 7:15 AM (within restricted hours)
- Result: **CANNOT DRIVE** (digit 0 is restricted on Friday during these hours)

**Scenario 4:** Plate DEF-1111, Monday at 10:00 AM
- Last digit: 1
- Day: Monday (restricted digits: 1, 2)
- Time: 10:00 AM (outside restricted hours)
- Result: **CAN DRIVE** (outside restricted time window)

---

### UC2: Handle Different Date Formats

**Actor:** User

**Description:** Users from different regions may input dates in various formats.

**Input Examples:**
- "2024-03-15" (ISO format)
- "15/03/2024" (DD/MM/YYYY)
- "03/15/2024" (MM/DD/YYYY)
- "15-Mar-2024"

**Process:**
1. System attempts to parse the date string
2. System recognizes the format
3. System converts to a standard internal representation
4. System proceeds with validation

---

### UC3: Handle Invalid Inputs

**Actor:** User

**Description:** Users may provide incorrect or malformed data.

**Invalid inputs:**
- Plate: "123" (too short)
- Plate: "ABCDEFGH" (no numbers)
- Date: "99/99/9999" (invalid date)
- Time: "25:00" (invalid time)

**Process:**
1. System validates each input
2. System detects the error
3. System returns a clear error message
4. System explains what format is expected

---

## Architecture Analysis

### From problem to Solution

When we analyze the Pico y Placa problem, we can identify several distinct responsibilities:

#### 1. **Data representation** (Models)

The problem involves two main entities:

- **License plate**: Represents a vehicle's identification
  - Needs to store the plate number
  - Needs to extract the last digit
  - This is a clear domain object

- **Pico y Placa rules**: Encapsulates the government regulation
  - Knows which digits are restricted each day
  - Knows the restricted time windows
  - This separates business rules from logic

**Why separate models?** If the rules change (e.g., government updates restrictions), we only modify the `PicoYPlacaRule` class without touching other parts.

#### 2. **Input validation** (Validators)

Users can make mistakes when typing. We need to verify:

- **License Plate Format**: Must match Ecuadorian plates (e.g., ABC-1234)
- **Date Format**: Must be a valid calendar date
- **Time Format**: Must be a valid time (0-23 hours, 0-59 minutes)

**Why separate validators?** Each input type has different validation rules. Separating them makes each validator simple and focused on one task.

#### 3. **Data transformation** (Parsers)

Different users prefer different formats:

- **Date parser**: Converts string dates to Date objects
  - Handles multiple formats (ISO, European, American)
  - Extracts day of week information

- **Time parser**: Converts string times to a comparable format
  - Handles "8:30 AM", "08:30", "20:30"
  - Converts to minutes for easy comparison

**Why separate parsers?** Parsing logic can be complex. Isolating it makes the code easier to understand and maintain.

#### 4. **Business logic** (Service)

The core responsibility: deciding if a car can drive.

- **PicoYPlacaPredictor**: Orchestrates all components
  - Uses validators to check inputs
  - Uses parsers to transform data
  - Uses models to apply business rules
  - Returns the final decision

**Why a service layer?** It coordinates different components without knowing their internal details. It's the "brain" that uses other parts.

#### 5. **User Interaction** (cli)

Users need a way to interact with the system:

- **Command Line Interface**: Handles user communication
  - Reads user input (keyboard or arguments)
  - Calls the predictor service
  - Shows results in a friendly format
  - Handles errors and shows helpful messages

**Why separate CLI?** The prediction logic shouldn't care if it's called from command line, web, or mobile. This separation allows us to add other interfaces later (e.g., REST API) without changing the core logic.

---

## Architecture Principles Applied

### Separation of concerns

Each component has one clear job:
- Models: Represent data and business rules
- Validators: Check if data is valid
- Parsers: Transform data between formats
- Service: Coordinate and make decisions
- CLI: Talk to the user

### Independence

Components don't depend on each other's implementation:
- Validators don't know about parsers
- Parsers don't know about models
- Service uses all but each can change independently

### Flexibility

The architecture allows easy changes:
- New date format? Add it to DateParser
- Rule change? Update PicoYPlacaRule
- New interface? Create it without touching the service
- Different input method? CLI is independent from logic

---

## Summary

The architecture emerged naturally from analyzing WHAT the system needs to do:

1. **Represent** plates and rules → Models
2. **Validate** user inputs → Validators  
3. **Transform** different formats → Parsers
4. **Decide** if car can drive → Service
5. **Communicate** with users → CLI

Each component solves a specific part of the problem, making the system easier to build, understand, and modify.
