/* *******************
    EQUATION HANDLING
   ******************* */
// stores currently entered equation as string
let equation = '0';

// stores previously entered value
let previousValue = 0;

// calcualates current equation
const evaluateEquation = function (eq) {
};


/* *****************
    BUTTON HANDLERS
   ***************** */
// backspace / delete
const buttonBackspace = function () {
  // resets equation to default if equation length is 1 instead of removing last value
  if (equation.length === 1) {
    previousValue = 0;
    equation = '0';
  // remove the last entered value
  } else {
    equation = equation.slice(0, -1);
    previousValue = equation[equation.length - 1];
  }
};

// numbers (0-9)
const buttonNumber = function (buttonValue) {
  // prevents default (0) from being at front of equation
  if (previousValue === 0 && equation.length === 1) {
    equation = buttonValue;
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
  console.log(`Previous Value: ${previousValue}\nPrevious Length: ${equation.length}\nButton Value: ${buttonValue}`);

  // if button is a number (not a function)
  if (buttonValue >= 0) {
    buttonNumber(buttonValue);

  // if button is 'backspace'
  } else if (buttonValue.charCodeAt(0) === 8592) {
    buttonBackspace();
  }

  console.log(`After Length: ${equation.length}`);
  return equation;
};


/* ******************
    BUTTON LISTENERS
   ****************** */
// adds listener for each button
const buttonListener = function () {
  const buttonValue = this.value;

  // update equation depending on the button pressed
  document.getElementById('equation').innerHTML = evaluateButtonPressed(buttonValue);

  // update calculation by evaluating the current equation
  evaluateEquation(equation);
};

// store HTMLCollection of all buttons as `buttons`
const buttons = document.getElementsByTagName('button');
console.log(buttons);

// iterate through `buttons` and add a listener for each
for (let i = 0; i < buttons.length; i += 1) {
  console.log(buttons.item(i), `value >= 0?: ${buttons.item(i).value >= 0}`);
  buttons.item(i).addEventListener('click', buttonListener);
}


/* *****************************************************
    TODO:
      - make sure a symbol isn't entered twice in a row
   ***************************************************** */
