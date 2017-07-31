window.onerror = function (error) {
  alert(error);
};

document.getElementById('equation').innerHTML = 'yes';

/* *******************
    EQUATION HANDLING
   ******************* */
// stores currently entered equation as string
let equation = '0';

// stores previously entered value
let previousValue = 0;

// handles whether or not to hide the calculation (for fake equals button)
let newEquationFlag = false;

// calcualates current equation
const evaluateEquation = function () {
  // stores current equation split into an array
  const eArr = equation.split(' ');

  // if equation does not end in an empty string
  if (/^(?![\s\S])/gi.test(eArr[eArr.length - 1])) {
    eArr.splice(eArr.length - 2, 2);
  }

  // multiplication and division in order left to right
  for (let i = 0; i < eArr.length; i += 1) {
    if (/[/*]/.test(eArr[i])) {
      eArr.splice(i - 1, 3, eArr[i] === '*' ? parseFloat(eArr[i - 1]) * parseFloat(eArr[i + 1]) : parseFloat(eArr[i - 1]) / parseFloat(eArr[i + 1]));
      i = 0;
    }
  }

  // addition and subtraction in order left to right
  for (let i = 0; i < eArr.length; i += 1) {
    if (/[+-]/.test(eArr[i])) {
      eArr.splice(i - 1, 3, eArr[i] === '+' ? parseFloat(eArr[i - 1]) + parseFloat(eArr[i + 1]) : parseFloat(eArr[i - 1]) - parseFloat(eArr[i + 1]));
      i = 0;
    }
  }

  return eArr.join(' ');
};


/* *****************
    BUTTON HANDLERS
   ***************** */
// equals ('=')
const buttonEquals = function () {
  // the equation is evaluated after every button press, the calculation hidden by default
  const calculationDisplay = document.getElementById('calculation').style;
  const equationDisplay = document.getElementById('equation').style;

  // make calculation visible for illusion of doing something
  calculationDisplay.visibility = 'visible';
  // adjust font sizes to make calculation stand out
  calculationDisplay.fontSize = '2em';
  equationDisplay.fontSize = '1em';

  newEquationFlag = true;
  previousValue = '=';
};

// mathmatical operation ('/', '*', '-', '+')
const buttonMathFunction = function (buttonValue) {
  // if previous value is a mathmatical operation
  if (/[/*\-+]/.test(previousValue)) {
    equation = equation.slice(0, -3);
  }
  previousValue = buttonValue;
  equation += ` ${buttonValue} `;
};

// clear 'C'
const buttonClear = function () {
  const calculationDisplay = document.getElementById('calculation').style;
  const equationDisplay = document.getElementById('equation').style;

  // sets font sizes to default
  calculationDisplay.visibility = 'hidden';
  calculationDisplay.fontSize = '1em';
  equationDisplay.fontSize = '2em';

  // sets everything else to default
  previousValue = 0;
  equation = '0';
  newEquationFlag = false;
  console.clear();
};

// backspace / delete '←'
const buttonBackspace = function () {
  // resets equation to default if equation length is 1 instead of removing last value
  if (equation.length === 1) {
    previousValue = 0;
    equation = '0';
  // remove the last entered value
  } else {
    // if last value is a space (follows a mathmatic function) remove last three values
    if (equation[equation.length - 1] === ' ') {
      equation = equation.slice(0, -3);
    // remove last value
    } else {
      equation = equation.slice(0, -1);
    }

    // stores last index of equation
    const length = equation.length - 1;

    // last value of equation is '.' (decimal) or ' ' (space / mathmatic funciton)
    if (equation[length] === '.' || equation[length] === ' ') {
      // set previousValue to one before last index of equation
      previousValue = equation[length - 1];
    // set previousValue to last index of equation
    } else {
      previousValue = equation[length];
    }
  }
};

// decimal '.'
const buttonDecimal = function () {
  // ^(\d+\.\d+)$ - matches any number with a decimal
  // ^\d+(\.\d+)?$ - matches any number with optional decimal
  // ^\d+$ - matches any number without a decimal

  // if previous value is a mathmatical operation & decimal is entered first in new segment / number
  if (/[/*\-+]/.test(previousValue)) {
    equation += '0.';
  // tests current segment / number for existing decimal
  } else if (/^\d+$/gi.test(equation.split(' ')[equation.split(' ').length - 1])) {
    equation += '.';
  }

  previousValue = '.';
};

// numbers (0-9)
const buttonNumber = function (buttonValue) {
  // splits and stores equation in an array
  const eArr = equation.split(' ');

  // prevents default (0) from being at front of a segment
  if (eArr[eArr.length - 1].length === 1 && previousValue == 0) { // eslint-disable-line eqeqeq
    eArr[eArr.length - 1] = buttonValue;
    equation = eArr.join(' ');
  // add buttonValue to end of equation
  } else { equation += buttonValue; }
  // update previous value
  previousValue = buttonValue;
};


/* *****************
    BUTTON HANDLING
   ***************** */
// runs the correct function depending on the button that is pressed
const evaluateButtonPressed = function (buttonValue) {
  console.log(`************************************\nBEFORE BUTTON:\nButton Pressed: ${buttonValue}\nPrevious Value: ${previousValue}\nEquation: ${equation}\nEquation Length: ${equation.length}`);

  // if flag is true start new equation
  if (newEquationFlag === true) {
    // set everything to default
    buttonClear();
  }

  switch (true) {
    // button is a number (not a mathmatical operation)
    case buttonValue >= 0:
      buttonNumber(buttonValue);
      break;
    // button is a mathmatical operation ('/', '*', '-', '+')
    case /[/*\-+]/.test(buttonValue):
      buttonMathFunction(buttonValue);
      break;
    // button is 'C' (clear)
    case buttonValue === 'clear':
      buttonClear();
      break;
    // button is '←' (backspace)
    case buttonValue === '←':
      buttonBackspace();
      break;
    // button is '.' (decimal)
    case buttonValue === '.':
      buttonDecimal();
      break;
    // button is '=' (equals)
    case buttonValue === '=':
      buttonEquals();
      break;
    // default set display to 'ERR'
    default:
      buttonClear();
      return 'ERR';
  }

  console.log(`AFTER BUTTON:\nPrevious Value: ${previousValue}\nEquation: ${equation}\nEquation Length: ${equation.length}\n************************************`);
  return equation;
};


/* ******************
    BUTTON LISTENERS
   ****************** */
// adds listener for each button
const buttonListener = function () {
  // update equation depending on the button pressed
  document.getElementById('equation').innerHTML = evaluateButtonPressed(this.value);

  // update calculation by evaluating the current equation
  document.getElementById('calculation').innerHTML = evaluateEquation();
};

// store HTMLCollection of all buttons as `buttons`
const buttons = document.getElementsByTagName('button');
console.log(buttons);

// iterate through `buttons` and add a listener for each
for (let i = 0; i < buttons.length; i += 1) {
  console.log(buttons.item(i), `value >= 0?: ${buttons.item(i).value >= 0}`);
  buttons.item(i).addEventListener('touchend', buttonListener);
}

// trigger buttons based on keyboard input
window.addEventListener('keyup', (event) => {
  const key = event.which || event.keyCode;

  // http://www.javascripter.net/faq/keycodes.htm useful site for keycodes

  // if multiply '*' is pressed via shift + 8
  if ((event.shiftKey && key === 56) || key === 106) {
    buttons[7].click();
  // if plus '+' is pressed via shift + '='
  } else if ((event.shiftKey && key === 61) || (event.shiftKey && key === 187) || key === 107) {
    buttons[17].click();
  // otherwise - normal key reading - in order of buttons array
  } else {
    switch (key) {
      case 55:  // 7
      case 103: // 7 (numpad)
        buttons[0].click();
        break;
      case 56:  // 8
      case 104: // 8 (numpad)
        buttons[1].click();
        break;
      case 57:  // 9
      case 105: // 9 (numpad)
        buttons[2].click();
        break;
      case 111: // divide (numpad)
      case 191: // forward slash '/'
      case 220: // back slash '\'
        buttons[3].click();
        break;
      case 52:  // 4
      case 100: // 4 (numpad)
        buttons[4].click();
        break;
      case 53:  // 5
      case 101: // 5 (numpad)
        buttons[5].click();
        break;
      case 54:  // 6
      case 102: // 6 (numpad)
        buttons[6].click();
        break;
      case 49:  // 1
      case 97:  // 1 (numpad)
        buttons[8].click();
        break;
      case 50:  // 2
      case 98:  // 2 (numpad)
        buttons[9].click();
        break;
      case 51:  // 3
      case 99:  // 3 (numpad)
        buttons[10].click();
        break;
      case 109: // subtract (numpad)
      case 173: // dash (on firefox) (mute on|off on chrome)
      case 189: // dash
        buttons[11].click();
        break;
      case 48:  // 0
      case 96:  // 0 (numpad)
        buttons[12].click();
        break;
      case 110: // decimal point (numpad)
      case 190: // period
        buttons[13].click();
        break;
      case 8: // backspace
        buttons[14].click();
        break;
      case 27:  // escape
      case 46:  // delete
      case 67:  // c
        buttons[15].click();
        break;
      // equals '='
      case 13:  // enter
      case 61:  // equal sign (firefox)
      case 187: // equal sign
        buttons[16].click();
        break;
      // default do nothing
      default:
        break;
    }
  }
}, true);


/* ***************************************************************************
    TODO (potentially outside scope as of this current time):
      - Limit length of equation otherwise it will go off screen (~16 digits)
      - Use exponent notation for long results
      - split numbers up with commas for easier reading
   *************************************************************************** */
