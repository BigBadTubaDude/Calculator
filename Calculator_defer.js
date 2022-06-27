/*
	Author: Coleman Alexander
	Date: 6/19/2022
	File: calculator_defer.js
*/
const OPERATORS = ["*", "/", "+", "-", "**"];
let inputText = "";
let presentText = inputText; //The extra step of holding in presentText allows help with troubleshooting and the spaces allow decimal point entry validation
let haveEvaluated = false; // boolean changes presentation of text when an answer is in the answer box
let answerNum = "";
let memoryResult = "";
let isEditing = false; //boolean for if backspace has been used. Determines if user wants text cleared in certain situations or wants to be able to edit current string(entering new number after equation)
const DIVIDE_BY_ZERO_ERROR = "Error: Division By Zero </br> Add, Backspace, or Clear text"
const OVERFLOW_ERROR = "Error: Overflow </br> Add, Backspace, or Clear text"
const PI = 3.141592653589793

function DivideZeroCheck() {
	var zeroString = false; // Is made true when loop is testing if a string of zeros is equal to zero
	if (inputText.indexOf("/") > 0) {
		for (var i = 0; i < inputText.length; i++) {
				if (inputText[i] == "/" && inputText[i + 1] == "0"){ // Finds any division sign followed by a zero
					zeroString = true;
					for (var x = i + 2; x < inputText.length; x++) { // Tests from the first index after the first zero for non zero numbers before an operator
						if (inputText[x] == ".") {
							continue;
						}
						if (OPERATORS.includes(inputText[x])) {
							zeroString = true;
							break;
							}
						else if (inputText[x] != "0") {
							zeroString = false;
							}
						}
					}	
				}
			}
	return zeroString;
	}
function negateAnswer() {
	if (document.getElementById("answerBar").innerHTML != "" && answerNum != DIVIDE_BY_ZERO_ERROR) { // If there is an answer in the answerBar, negate multiplies answer by -1
		answerNum *= -1;
		document.getElementById("answerBar").innerHTML = answerNum;
	}
	else if ((OPERATORS.includes(inputText[inputText.length - 1]) || inputText === "" || inputText[inputText.length - 1] == "(") && inputText[inputText.length - 1] != "-"){ //If no answer is in answerBar, last enter was an operator or a left parentheses negate adds negative sign to next number
		inputText += " -";
		presentText = convertToPresentable(inputText);
		document.getElementById("inputBar").innerHTML = presentText;
	}
}
function clearAnswer() {
	document.getElementById("answerBar").innerHTML = "";
	answerNum = ""
	isEditing = false;
}
function clearText() {
	clearAnswer();
	document.getElementById("inputBar").innerHTML = "";
	inputText = "";
	answerNum = "";
	haveEvaluated = false;
	isEditing = false;
}
function convertToPresentable(givenText) { // This takes the held string capaable of math and changes the / to a division sign for presentation on the calulator
	var newText = "";

	for (var i = 0; i < givenText.length; i++) {
		if (givenText[i] === "/") {
			newText += " " + "&divide;" + " ";
			}
		else if (givenText.substr(i, 2) === "**") {
			newText += " ^ ";
			givenText = givenText.substring(0, i + 1) + givenText.substring(i + 2, givenText.length); //removes following * so it is not evaluated as a multiply in next loop
		}
		else if (givenText.substr(i - 1, 2) == " -") { // differentiates between minus and negative. only adds space before "-"
			newText += " -"
		}
		else if (givenText[i] === "*"){
			if (givenText.substr(i, 18) == "*" + PI) { //Allows user to enter pi as a variable, such as 9π - 3
				newText += "&pi;";
				i += 17;
				continue;
			}
			else {
				newText += " x ";
			}
		}
		else if (OPERATORS.includes(givenText[i])){
			newText += " " + givenText[i] + " ";
		}
		else if (givenText.substr(i, 17) == PI) { //Converts pi literal to symbol
			newText += "&pi;";
			i += 16; // skips rest of pi literal
		}
		else if (givenText[i] === "(") {
			newText += "(";
		}
		else if (givenText[i] === ")") {
			newText += ")";
		}
		else {
			newText += givenText[i];
		}
	}
	return newText;
}
function pressNum(num) {
		if (answerNum != "" && isEditing === false && answerNum != DIVIDE_BY_ZERO_ERROR) { //If there is text in the answer box, typing a number will start a new equation. If the divided by zero error is displayed, the zero can be deleted and a new number added
			clearText()
			}
		if (inputText[inputText.length - 1] != ")") {
			if (num == "pi" && (inputText == "" || inputText[inputText.length - 1] == "(" || OPERATORS.includes(inputText[inputText.length - 1]) || !isNaN(inputText[inputText.length - 1]))){ // inputText must be empty or last entered number must be "(", a number or an operator
				if (!isNaN(inputText[inputText.length - 1])){
					inputText += "*" + PI;
				}
				else {
					inputText += PI;
				}
			}
			else if (num != "pi" && inputText.substr(inputText.length - 17, 17) != PI) {	
				inputText += String(num);
			}
		presentText = convertToPresentable(inputText);
		document.getElementById("inputBar").innerHTML = presentText;
		}
}
function addDecimal(dec) {
	if ((presentText.lastIndexOf(".") <= presentText.lastIndexOf(" ")) || !inputText.includes(".")) { // allows decimal point only under these circumstances
		if (!isNaN(inputText[inputText.length - 1])) {
			inputText += String(dec);
			presentText = convertToPresentable(inputText);
			document.getElementById("inputBar").innerHTML = presentText;
			}
		else if (OPERATORS.includes(inputText[inputText.length - 1]) || inputText[inputText.length - 1] == "(" || inputText == "") { // If last character in inputText is "(", an operator, or if InputText is empty, "0." will be added to inputText
			inputText += "0.";
			presentText = convertToPresentable(inputText);
			document.getElementById("inputBar").innerHTML = presentText;
		}
	}
}

function pressOperator(operator) {
	if (haveEvaluated && answerNum != DIVIDE_BY_ZERO_ERROR && isEditing === false) {
		inputText = answerNum;
		document.getElementById("inputBar").innerHTML = inputText;
		clearAnswer();
		haveEvaluated = false;
	}
	if ( !OPERATORS.includes(inputText[inputText.length - 1]) && inputText[inputText.length - 1] != "." && typeof parseInt(inputText[inputText.length - 1]) === "number" && inputText[inputText.length - 1] != "(" && inputText != "" || inputText[inputText.length - 1] === ")" ) { //only allows operator to be added to string if last input was a number
		inputText += operator;
		presentText = convertToPresentable(inputText);
		document.getElementById("inputBar").innerHTML = presentText;
	}
}
function executeEquation() {
	if ((!isNaN(inputText[inputText.length - 1])) || inputText[inputText.length - 1] === ")" ) { //only allows equation to be calculated if last character is a number
		answerNum = eval(inputText);
		if (DivideZeroCheck()) {
			answerNum = DIVIDE_BY_ZERO_ERROR;
		}
		else if (answerNum === Infinity || answerNum === -Infinity) {
			answerNum = OVERFLOW_ERROR;
		}
		//if (String(answerNum).length > 8) {
		//	answerNum = answerNum.toExponential(3);
		//}
		document.getElementById("answerBar").innerHTML = answerNum;
		haveEvaluated = true;
		isEditing = false;
	}
}
function addParentheses(direction) {
	var leftCount = 0; 
	var rightCount = 0;
	for (var i = 0; i < inputText.length; i++) {// counts number of left parenteses
		if (inputText[i] === "(") {
			leftCount += 1;
		}
		else if (inputText[i] === ")") {
			rightCount += 1;
		}
	}
	if (answerNum != "" && answerNum != DIVIDE_BY_ZERO_ERROR) {
		clearText()
		}
	if (direction === "left" && (inputText === "" || inputText[inputText.length - 1] == "(" || OPERATORS.includes(inputText[inputText.length - 1]))) {
		inputText += "(";
		presentText = convertToPresentable(inputText);
		document.getElementById("inputBar").innerHTML = presentText;
		}
	else if (direction === "right" && (!isNaN(inputText[inputText.length - 1]) || inputText[inputText.length - 1] === ")") && leftCount > rightCount){
		inputText += ")";
		presentText = convertToPresentable(inputText);
		document.getElementById("inputBar").innerHTML = presentText;
		}
	}

function displayMemory() {
	if (memoryResult == ""){
		memoryResult = document.getElementById("answerBar").innerHTML;
	}
	else {
		if (memoryResult[0] == "-") { // If memory is negative, adds space so eval() knows its a negative sign and not an operator (eg. 9- -5 as opposed to 9--5)
			inputText += " " + memoryResult;
			}
		else {
			inputText += memoryResult;
			}
		presentText = convertToPresentable(inputText);
		document.getElementById("inputBar").innerHTML = presentText;
		memoryResult = "";
	}
}
function backspace() {
	if (inputText.substr( inputText.length - 2, 2) == "**" || inputText.substr(inputText.length - 2, 2) == " -") { //If last entry was ^ or a negation of the next number, 2 characters are deleted
		inputText = inputText.slice(0, -2);	
	}
	else if (inputText.substr(inputText.length - 18, 18) == "*" + PI) { //If last entry was a condensed pi (eg. 9π), both pi and the * sign is deleted
		inputText = inputText.slice(0, -18);
	}
	else if (inputText.substr(inputText.length - 17, 17) == PI) {
		inputText = inputText.slice(0, -17);
	}
	else {
		inputText = inputText.slice(0, -1);
	}
	presentText = convertToPresentable(inputText);
	document.getElementById("inputBar").innerHTML = presentText;
	isEditing = true;
}