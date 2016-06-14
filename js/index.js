var app = angular.module('CalcApp',[]);
app.constant('OPR', {
  '/': true,
  '+': true,
  '-': true,
  '%': true,
  '*': true
});
app.controller('CalcCtrl', function(OPR) {
  var cl = this;
  cl.display = '';
  cl.resStr = '';
  
  cl.isDecimal = function() {//If the pressed button is '.'
    if (isOperator(cl.display)) { //If an operator is already present in the display.
      cl.resStr+=cl.display;//Move it to resStr and push the 0. to the display
      cl.display = '0.';
    }
    if (cl.isFinal || cl.display === '') {//If The result has already been shown or the display does not consits anything then push '0.' in the display
      cl.display = '0.';
    } 
    else if (!/\./g.test(cl.display)) {//To ensure that the display does not consists any other '.' for example 0.3.0 is not possible.
      cl.display += '.';
    }
    cl.isFinal = false;//Till now the result has not been shown. cl.isFinal is only true when the 'isEquals' is pressed. 
  };

  cl.clearAll = function() {//To clear everything from the screen and console
    cl.display = '';
    cl.resStr = '';
    cl.isFinal = false;
  };
  
  cl.btnPressed = function(btn) {//If a button press is encountered.
    if (cl.display === 'error') //if the display previously encountered an error.
      cl.display = '';
    if (isOperator(btn)) {//if operator
      if ((isOperator(cl.display) || (cl.display === '' && cl.resStr === '') || (cl.display === '' && isOperator(cl.resStr.slice(-1))))) {//To eleminate all exceptions, such as first input can never be a operator.
        return;
      }
      if (cl.display !== '') cl.display = (cl.display * 1).toString();//converting.
      if (cl.display.substring(0, 1) === '-') {//for example -373 was in the result. So, making sure that no problem arises in the future for example -33+33 shows error. (-33)+33 will give 0.
        cl.resStr += '\(' + cl.display + '\)';
      } 
      else {
        cl.resStr += cl.display;
      }
      cl.display = btn;//show the button pressed in the display
      cl.isFinal = false;
    } 
    else {//Similarly handling all exceptions for buttons which are not operator (numbers only)
      if (cl.display === '' && cl.resStr && !isOperator(cl.resStr.slice(-1))) return;
      if (isOperator(cl.display)) {
        cl.resStr += cl.display;
        cl.display = btn;
      } else if (cl.display === '0' || cl.display === '') {
        cl.display = btn;
      } else if (cl.isFinal) {
        cl.display = btn;
      } else {
        cl.display += btn;
      }
      cl.isFinal = false;
    }
  };

  cl.clearDisplay = function() {//To clear only the current entry
    cl.display = '';
    cl.isFinal = false;
  };
  
  cl.deleteBack=function(){//to remove the last button pressed, eliminating the exceptions
		if(cl.display==='')
			return;
		cl.display=cl.display.slice(0,cl.display.length-1);
		cl.isFinal=false;
	};
  
  cl.result = function() {//Finally when the equals is pressed.
    if (isOperator(cl.display)||(cl.display==='' && cl.resStr === '')) return;
    if (cl.display.substring(0, 1) === '-') {
      cl.resStr += '\(' + cl.display + '\)';
    } else {
      cl.resStr += cl.display;
    }
    try {
      cl.display = eval(cl.resStr);
    } 
    catch (e) {
      cl.display = 'error';
    }
    cl.resStr = '';
    cl.isFinal = true;
  };

  function isOperator(btn) {//To check if true.
    return OPR.hasOwnProperty(btn);
  };
});