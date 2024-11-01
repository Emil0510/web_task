const opArea = document.querySelector('.op-area');
const resultArea = document.querySelector('.result-area');
const resultDisplay = document.querySelector('.result');
const keys = document.querySelectorAll('.key');


let currentInput = '';
let result = 0; 
let resetScreen = false;
let allowDecimal = true;


function handleKeyClick(event) {
    const key = event.target;
    const keyValue = key.textContent;
    const isOperator = key.classList.contains('op');
    const isNumber = key.classList.contains('num');

    
    if (resetScreen && (isNumber || isOperator)) {
        currentInput = resetScreen && isOperator ? result.toString() : '';
        resultArea.classList.add('hidden');
        resetScreen = false;
        allowDecimal = true;
    }

    if (isNumber) {
        
        if (keyValue !== '.' && currentInput === '0') {
            currentInput = keyValue;
        } else if (keyValue === '.' && (!currentInput || /[\+\-X/%]$/.test(currentInput))) {
            currentInput += '0.';
            allowDecimal = false;
        } else if (keyValue === '.' && !allowDecimal) {
            return;
        } else if (keyValue === '.') {
            currentInput += keyValue;
            allowDecimal = false;
        } else {
            currentInput += keyValue;
        }
        updateDisplay(currentInput);
    } else if (isOperator) {
        handleOperator(keyValue);
    }
}


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

function updateDisplay(displayValue) {
    opArea.textContent = displayValue;
}

function clearAll() {
    currentInput = '0';
    result = 0;
    resetScreen = false;
    allowDecimal = true;
    resultArea.classList.add('hidden');
    updateDisplay(currentInput);
}


function backspace() {
    if (currentInput.slice(-1) === '.') {
        allowDecimal = true;
    }
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay(currentInput);
}

function toggleSign() {

    const lastNumberMatch = currentInput.match(/-?\d+(\.\d+)?$/);
    lastNumberMatch.forEach(e => console.log(e));

    if (lastNumberMatch) {
        let lastNumber = lastNumberMatch[0];
        console.log(lastNumber);
        const negatedNumber = lastNumber.startsWith('-')
            ? lastNumber.slice(1)
            : ' -' + lastNumber;
        
        currentInput = currentInput.slice(0, -lastNumber.length) + negatedNumber;
        
        updateDisplay(currentInput.replace(/\*/g, 'x'));  
    }

}


function addOperatorToInput(operator) {
    if (currentInput && !/[\+\-X/%]$/.test(currentInput)) {
        currentInput += operator === 'X' ? '*' : operator;
        updateDisplay(currentInput);
        allowDecimal = true;
        resetScreen = false;
    }
}


function calculateResult() {
    try {
        result = Function('"use strict"; return (' + currentInput.replace('X', '*') + ')')();
        resultDisplay.textContent = formatResult(result);
        resultArea.classList.remove('hidden');
        currentInput = result.toString();
        resetScreen = true;
    } catch (error) {
        alert('Invalid expression');
        clearAll();
    }
}


function formatResult(value) {
    const precisionThreshold = 1e-10;
    
    if (Math.abs(value - Math.round(value)) < precisionThreshold) {
        return Math.round(value);
    }
    
    return parseFloat(value.toFixed(10));
}


keys.forEach(key => key.addEventListener('click', handleKeyClick));
