
// Select elements
const opArea = document.querySelector('.op-area');
const resultArea = document.querySelector('.result-area');
const resultDisplay = document.querySelector('.result');
const keys = document.querySelectorAll('.key');

// Variables to store operation data
let currentInput = ''; // stores user input
let result = 0; // stores calculation result
let resetScreen = false; // flag to reset input after calculation
let allowDecimal = true; // flag to allow decimal point in each new number

// Function to handle button clicks
function handleKeyClick(event) {
    const key = event.target;
    const keyValue = key.textContent;
    const isOperator = key.classList.contains('op');
    const isNumber = key.classList.contains('num');

    // If screen needs to be reset for new calculation
    if (resetScreen && (isNumber || isOperator)) {
        currentInput = resetScreen && isOperator ? result.toString() : ''; // Use previous result if operator is pressed
        resultArea.classList.add('hidden'); // Hide previous result
        resetScreen = false;
        allowDecimal = true; // Reset decimal allowance for new entry
    }

    if (isNumber) {
        // If a non-decimal digit is entered and the current input is '0', replace it
        if (keyValue !== '.' && currentInput === '0') {
            currentInput = keyValue; // Replace leading zero with the new number
        } else if (keyValue === '.' && (!currentInput || /[\+\-X/%]$/.test(currentInput))) {
            currentInput += '0.';
            allowDecimal = false; // Disable decimal for current number
        } else if (keyValue === '.' && !allowDecimal) {
            return; // Prevent multiple dots in the same number
        } else if (keyValue === '.') {
            currentInput += keyValue; // Add decimal if allowed
            allowDecimal = false;
        } else {
            currentInput += keyValue; // Append the number to input
        }
        updateDisplay(currentInput);
    } else if (isOperator) {
        handleOperator(keyValue);
    }
}

// Function to handle operator input
function handleOperator(operator) {
    switch (operator) {
        case 'C':
            clearAll();
            break;
        case '←':
            backspace();
            break;
        case '±':
            toggleSign();
            break;
        case '=':
            calculateResult();
            break;
        default:
            addOperatorToInput(operator);
            break;
    }
}

// Update the display based on current input
function updateDisplay(displayValue) {
    opArea.textContent = displayValue;
}

// Clear all input and reset the calculator
function clearAll() {
    currentInput = '0';
    result = 0;
    resetScreen = false;
    allowDecimal = true; // Reset decimal allowance
    resultArea.classList.add('hidden');
    updateDisplay(currentInput);
}

// Remove the last character in the current input
function backspace() {
    if (currentInput.slice(-1) === '.') {
        allowDecimal = true; // Enable decimal if the last character was a dot
    }
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay(currentInput);
}

// Toggle the sign of the current input, accounting for scenarios with leading zeroes and results
function toggleSign() {
    if (currentInput) {
        if (currentInput === '0' || currentInput === '0.') {
            // Ignore if input is zero or zero with decimal
            return;
        }
        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1); // Remove '-' for positive value
        } else {
            currentInput = '-' + currentInput; // Add '-' for negative value
        }
        updateDisplay(currentInput);
    }
}

// Append operator to current input and prepare for next input
function addOperatorToInput(operator) {
    if (currentInput && !/[\+\-X/%]$/.test(currentInput)) {
        currentInput += operator === 'X' ? '*' : operator;
        updateDisplay(currentInput);
        allowDecimal = true; // Enable decimal for the next number in sequence
        resetScreen = false;
    }
}

// Perform the calculation and display the result
function calculateResult() {
    try {
        result = Function('"use strict"; return (' + currentInput.replace('X', '*') + ')')();
        resultDisplay.textContent = formatResult(result);
        resultArea.classList.remove('hidden');
        currentInput = result.toString(); // Set currentInput to the result for further operations
        resetScreen = true;
    } catch (error) {
        alert('Invalid expression');
        clearAll();
    }
}

// Function to display a nicely formatted result if necessary
function formatResult(value) {
    const precisionThreshold = 1e-10;
    
    if (Math.abs(value - Math.round(value)) < precisionThreshold) {
        return Math.round(value);
    }
    
    return parseFloat(value.toFixed(10));
}

// Add event listeners to buttons
keys.forEach(key => key.addEventListener('click', handleKeyClick));
