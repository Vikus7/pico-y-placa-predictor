# Pico y Placa Predictor

A command-line application that predicts whether a vehicle can be on the road based on Quito-Ecuador's "Pico y Placa" restrictions.

## About

This project implements a predictor for Quito's vehicle circulation restrictions. The system determines if a vehicle with a specific license plate number can circulate on a given date and time, following the official "Pico y Placa" regulations.

## Problem Statement

The "Pico y Placa" is a traffic regulation in Quito that restricts vehicle circulation based on the last digit of the license plate number, the day of the week, and specific time windows during the day.

The application will:
- Accept a license plate number (e.g., PBX-1234)
- Accept a date in **DD/MM/YYYY** or **DD-MM-YYYY** format (e.g., 15/03/2024 or 15-03-2024)
- Accept a time in **HH:MM** 24-hour format (e.g., 08:30, 17:00)
- Return whether the vehicle can be on the road or not

### Input Format Requirements

- **Date**: DD/MM/YYYY or DD-MM-YYYY (e.g., "15/03/2024", "15-03-2024")
- **Time**: HH:MM in 24-hour format (e.g., "08:30", "17:00")
- **License Plate**: Ecuadorian format with 3 letters, hyphen, and 4 digits (e.g., "PBX-1234")

## Technologies

- **JavaScript (ES6+)**: Core programming language
- **Node.js**: Runtime environment for script execution
- **Jest**: Testing framework for unit and integration tests
- **Git**: Version control system

### Why Node.js?

This project is written in pure JavaScript and runs as a console application using **Node.js**. While it's not a Node.js project in the traditional sense (no web server, no Express, etc.), Node.js is required to execute the JavaScript files outside of a browser environment.

Node.js provides:
- JavaScript runtime for command-line execution
- Access to file system and console I/O
- Module system for organizing code
- NPM for managing development dependencies (like Jest)

## Project Structure

```
pico-y-placa-predictor/
├── docs/                           # Documentation
│   └── use-cases-and-architecture.md
├── src/                            # Source code
│   ├── models/                     # Domain models
│   ├── validators/                 # Input validators
│   ├── parsers/                    # Data parsers
│   ├── services/                   # Business logic
│   ├── cli/                        # Command-line interface
│   └── index.js                    # Entry point
├── tests/                          # Test files
│   ├── unit/                       # Unit tests
│   └── integration/                # Integration tests
├── package.json                    # Project configuration
└── README.md                       # This file
```

## Documentation

- **[Use Cases and Architecture](docs/use-cases-and-architecture.md)**: Detailed analysis of the problem domain, use cases, and architectural decisions

## Development Approach

This project follows:
- Object-Oriented Programming (OOP) paradigm
- Incremental development with meaningful commits
- Conventional Commits standard
- Separation of concerns architecture

## Project Status

🚧 **In Development** - Project structure setup complete

### Current Phase
- ✅ Initial repository setup
- ✅ Project structure defined
- ✅ Dependencies configured
- ⏳ Feature implementation (upcoming)

---

*Last updated: December 2025*
