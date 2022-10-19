"use strict";
const head = document.querySelector("head");
const slider = document.getElementById("theme");
const mainCss = document.getElementById("main.css");
const keypad = document.querySelector(".calc-keypad");
const screen = document.querySelector(".screen-input");

const container = document.querySelector(".container");

// ==========================================

// ==========================================
const calculator = {
    displayValue: "0",
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

const updateDisplay = () => {
    let numbers = calculator.displayValue;
    const options = {
        style: `currency`,
        currency: `GBP`,
    };
    let formattedNumber = new Intl.NumberFormat(options).format(numbers);

    screen.innerHTML = formattedNumber;
};

const inputFunc = (digit) => {
    const {
        displayValue,
        waitingForSecondOperand
    } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === `0` ? digit : displayValue + digit;
    }
};

const inputDecimal = (dot) => {
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = `0.`;
        calculator.waitingForSecondOperand = false;
        return;
    }

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
        console.log(`here`);
    }
};

const handleOperator = (nextOperator) => {
    const {
        firstOperand,
        displayValue,
        operator
    } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
};

const calculate = (firstOperand, secondOperand, operator) => {
    if (operator === `+`) {
        return firstOperand + secondOperand;
    } else if (operator === "-") {
        return firstOperand - secondOperand;
    } else if (operator === "*") {
        return firstOperand * secondOperand;
    } else if (operator === "/") {
        return firstOperand / secondOperand;
    }

    return secondOperand;
};

const resetCalculator = () => {
    calculator.displayValue = "0";
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
};

const deleteLastDigit = (value) => {
    if (value === `del`) {
        const delDigit = calculator.displayValue.slice(0, -1);
        calculator.displayValue = delDigit;
    }
};

keypad.addEventListener("click", (event) => {
    const {
        target
    } = event;
    const {
        value
    } = target;

    if (!target.matches("button")) {
        return;
    }

    switch (value) {
        case "+":
        case "-":
        case "*":
        case "/":
        case "=":
            handleOperator(value);
            break;
        case ".":
            inputDecimal(value);
            break;
        case "reset":
            resetCalculator();
            break;
        case "del":
            deleteLastDigit(value);
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputFunc(value);
            }
    }

    updateDisplay();
});
// =============================================
// Theme Slider

const curTheme = localStorage.getItem(`theme`);

const switchTheme = (val) => {
    if (!val) return;

    slider.setAttribute(`value`, val);

    if (head.lastChild.previousSibling.id === `main-css`) {
        head.removeChild(head.lastChild);
    }


    head.insertAdjacentHTML(`beforeEnd`, `<link rel="stylesheet" href="theme-${val}.css" />`);

    // Sets the current theme `val` to `theme` key in local storage
    localStorage.setItem(`theme`, val);
};

// Checks if an input has been made to theme slider
slider.oninput = (e) => {
    // Calls switchTheme
    switchTheme(slider.value);
};

// Checks the current theme and loads it
switchTheme(curTheme);