document.addEventListener("DOMContentLoaded", func_clear);

var calc_buttons = document.getElementsByTagName('button'),
	calc_basic_operations = document.getElementsByClassName('button_basic_operations'),
	calc_keyboard = document.getElementsByTagName ('body');

var calc_display = document.getElementById('display1'),
	calc_status = document.getElementById('status1');
var calc_event, 
	operand_1 = 0, operand_2 = 0, operation = "",
	operation_check = 0,  		// может быть 0 - если вводится первый операнд, 1 - если повторно нажимается действие, и 2 - если вводится второй операнд
	equals_check = 0,	  		
	result_operation = 0, 
	save_status, 
	operation_equals = 0, 		// отвечает за конструкцию х*= если равен 1, то операнду 2 присваевается значение операнда 1
	check_dot = 0;

//инициализация нажатия кнопки на клавиатуре
calc_keyboard.onkeydown = calc_keyboard.onkeyup = calc_keyboard.onkeypress = calc_keyboard_pressed;
calc_keyboard = document.addEventListener ("keydown", calc_keyboard_pressed);

// инициализация нажатия любой кнопки на калькуляторе
for (var i=0; i<calc_buttons.length; i++) {
	var k = calc_buttons[i];
	k.addEventListener ('click', calc_button_pressed);
};

//функция присваивает calc_event значение при нажатой кнопке клавиатуры
function calc_keyboard_pressed (e) {
	// вводы цифр с клавиатуры, где 48-57 - основной ряд, 96-105 - цифровая клавиатура
	if (e.keyCode == '48' || e.keyCode == '49' || e.keyCode == '50' || e.keyCode == '51' || 
		e.keyCode == '52' || e.keyCode == '53' || e.keyCode == '54' || e.keyCode == '55' ||
		e.keyCode == '56' || e.keyCode == '57' || e.keyCode == '96' || e.keyCode == '97' ||
		e.keyCode == '98' || e.keyCode == '99' || e.keyCode == '100' || e.keyCode == '101' ||
		e.keyCode == '102' || e.keyCode == '103' || e.keyCode == '104' || e.keyCode == '105') {
		calc_event = Number(e.key);
		func_number_pressed (calc_event);
	};
	//ввод остальных кнопок
	switch (e.key) {
		case "+":
			calc_event = "+";
			func_basic_operation(calc_event);
		break;
		case "-":
			calc_event = "-";
			func_basic_operation(calc_event);
		break;
		case "*":
			calc_event = "*";
			func_basic_operation(calc_event);
		break;
		case "/":
			calc_event = "/";
			func_basic_operation(calc_event);
		break;
		case ".":
			calc_event = "dot";
			func_number_pressed (calc_event);
		break;
		case ",":
			calc_event = "dot";
			func_number_pressed (calc_event);
		break;
		case "Enter":
			func_equals ();
		break;
		case "Escape":
			func_clear ();
		break;
		case "Backspace":
			func_backspace ();
		break;
		case "Delete":
			func_clear_operand ();
		break;
	};
	
};

//функция присваивает calc_event значение при нажатом элементе button
function calc_button_pressed (e) {
	if (e.srcElement.className == "button_numbers") {
		calc_event = Number(e.srcElement.name);
		func_number_pressed (calc_event);
	};
	if (e.srcElement.className == "button_basic_operations") {
		calc_event = e.srcElement.innerHTML;
		func_basic_operation(calc_event);
	};
	switch (e.srcElement.name) {
		case "C":
			func_clear ();
		break;
		case "CE":
			func_clear_operand ();
		break;
		case "backspace":
			func_backspace ();
		break;
		case "=":
			func_equals ();
		break;
		case "dot":
			calc_event = "dot";
			func_number_pressed (calc_event);
		break;
		case "smenaZnaka":
			func_smenaZnaka();
		break;
		case "part":
			func_part();
		break;
		case "sqrt":
			func_sqrt();
		break;
		case "percent":
			func_percent();
		break;
	};
};

// обработчик нажатия цифр
function func_number_pressed (calc_event) {
	if (calc_display.value == "0") {
		calc_display.value = "";
	};
	if (equals_check == 1) {
		calc_display.value = "";
		equals_check = 0;
	};
	if (operation_check == 1) {
		calc_display.value = "";
		operation_check = 2;
		check_dot = 0;
	}
	for (var i=0; i<calc_display.value.length; i++) {
		if (calc_display.value[i] == "." || calc_display.value[i] == ",") {
			check_dot = 1;
		};
	};
	switch (calc_event) {
		case 0:
				calc_display.value += "0";
			break;
		case 1:	
				calc_display.value += "1";
			break;
		case 2:
				calc_display.value += "2";
			break;
		case 3:
				calc_display.value += "3";
			break;
		case 4:	
				calc_display.value += "4";
			break;
		case 5:
				calc_display.value += "5";
			break;
		case 6:
				calc_display.value += "6";
			break;
		case 7:
				calc_display.value += "7";
			break;
		case 8:
				calc_display.value += "8";
			break;
		case 9:
				calc_display.value += "9";
			break;
		case "dot":
				if (check_dot == 0) {
					if (calc_display.value == "") {
						calc_display.value = "0.";
						check_dot = 1;
					} else {
						calc_display.value += ".";
						check_dot = 1;
					}
				};
			break;
	};
	if (operation_check == 0) {operand_1 = Number(calc_display.value);};
	if (operation_check == 2) {operand_2 = Number(calc_display.value);};
	operation_equals = 0;
};	

// базовые функции + - * /
function func_basic_operation(calc_event) {
	operation_equals = 1;
	// запись действия в operation и добавление его в calc_status
	if (operation_check == 0) {
		switch (calc_event) {
			case "+":
				operation = "+";
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
				calc_status.value += operand_1 + " + ";
				} else {
					calc_status.value += " + ";
				}
				break;
			case "-":
				operation = "-";
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					calc_status.value += operand_1 + " - ";
					} else {
						calc_status.value += " - ";
					}
				break;
			case "*":
				operation = "*";
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					calc_status.value += operand_1 + "* ";
					} else {
						calc_status.value += " * ";
					}
				break;
			case "/":
				operation = "/";
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					calc_status.value += operand_1 + " / ";
					} else {
						calc_status.value += " / ";
					}
				break;
		};
		operation_check = 1;
	};

	// замена действия в operation и calc_status при повторном нажатии действия
	if (operation_check == 1) {
		if (calc_event != operation) {
			var str = calc_status.value.slice(0, -2);
			switch (calc_event) {
				case "+":
					operation = "+";
					calc_status.value = str + "+ ";
				break;
				case "-":
					operation = "-";
					calc_status.value = str + "- ";
				break;					
				case "*":
					operation = "*";
					calc_status.value = str + "* ";
				break;					
				case "/":
					operation = "/";
					calc_status.value = str + "/ ";
				break;
			};
		};
	};

	// запись действия в operation и добавление его в calc_status, но уже с замено содержимого calc_display на результат предыдущего вычисления
	if (operation_check == 2) {
		operation_equals = 0;
		switch (calc_event) {
			case "+":
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					save_status = calc_status.value + operand_2 + " + ";
					} else {
						save_status = calc_status.value + " + ";
					}
				func_equals();
				operation = "+";
			break;
			case "-":
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					save_status = calc_status.value + operand_2 + " - ";
					} else {
						save_status = calc_status.value + " - ";
					}
				func_equals();
				operation = "-";		
			break;
			case "*":
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					save_status = calc_status.value + operand_2 + " * ";
					} else {
						save_status = calc_status.value + " * ";
					}
				func_equals();
				operation = "*";
			break;
			case "/":
				if (calc_status.value.charAt(calc_status.value.length - 1) != ")") {
					save_status = calc_status.value + operand_2 + " / ";
					} else {
						save_status = calc_status.value + " / ";
					}
				func_equals();
				operation = "/";
			break;
		};
		calc_status.value = save_status;
		operation_check = 1;
	};
};

// кнопка =
function func_equals () {
	if (operation_equals == 1) {
		operand_2 = operand_1;
		operation_equals = 0;
	}
	switch (operation) {
		case "+":
			result_operation = operand_1 + operand_2;
			calc_status.value = "";
			calc_display.value = result_operation;
			console.log (operand_1, operand_2, result_operation);
			operand_1 = result_operation;
			operation_check = 0;
			
		break;
		case "-":
			result_operation = operand_1 - operand_2;
			calc_status.value = "";
			calc_display.value = result_operation;	
			operand_1 = result_operation;
			operation_check = 0;
		break;
		case "*":
			result_operation = operand_1 * operand_2;
			calc_status.value = "";
			calc_display.value = result_operation;
			operand_1 = result_operation;
			operation_check = 0;
		break;
		case "/":
			if (operand_2 == 0) {
				calc_display.value = "Деление на ноль невозможно";
				func_error();
			} else {
			result_operation = operand_1 / operand_2;
			calc_status.value = "";
			calc_display.value = result_operation;
			operand_1 = result_operation;
			operation_check = 0;
			};
		break;
	};
	equals_check = 1;
};

// кнопка С - сброс
function func_clear () {
	calc_display.value = "0"; calc_status.value = "";
	console.clear();
	operand_1 = 0; 
	operand_2 = 0;
	result_operation = 0;
	operation = "";
	operation_check = 0;
	check_dot = 0;
	// цикл сброса заблокированных клавиш (после деления на ноль)
	for (var i=0; i<calc_buttons.length; i++) {
		calc_buttons[i].disabled = false;
	};
};

// кнопка СЕ - очистка текущего calc_display
function func_clear_operand () {
	calc_display.value = "0";
	if (operation_check == 0) {operand_1 = Number(calc_display.value);};
	if (operation_check == 2) {operand_2 = Number(calc_display.value);};
	operation_equals = 0;
	check_dot = 0;
}

// кнопка удаления последнего символа в calc_display
function func_backspace () {
	if (operation_equals != 1 && equals_check !=1) {
		if (calc_display.value.length > 1) {
			var str = calc_display.value.slice(0, -1);
			calc_display.value = str;	
		} else 
		{
			calc_display.value = "0";
		};
		if (operation_check == 0) {operand_1 = Number(calc_display.value);};
		if (operation_check == 2) {operand_2 = Number(calc_display.value);};
	};
};
// кнопка смены знака
function func_smenaZnaka () {
	if (calc_display.value != "0") {
		var smena = Number(calc_display.value) * -1;
		calc_display.value = smena;
		if (operation_check == 0) {operand_1 *= -1;};
		if (operation_check == 2) {operand_2 *= -1;};
	};
};

// кнопка вычисления доли 1/х
function func_part () {
	var per_part = Number(calc_display.value);
	if (per_part != 0) {
		if (operation_check == 0) {operand_1 = 1 / per_part; calc_display.value = operand_1;};
		if (operation_check == 2) {operand_2 = 1 / per_part; calc_display.value = operand_2;};
		calc_status.value += "part(" + per_part + ")";
	} else {
		func_error();
		calc_display.value = "Деление на ноль невозможно";
	}
}

// кнопка вычисления квадратного корня
function func_sqrt () {
	calc_status.value += "sqrt(" + calc_display.value + ")";
	
	var per_sqrt = Number(calc_display.value);
	console.log(per_sqrt);
	

	if (per_sqrt >= 0) {

		if (operation_check == 0) {
			operand_1 = Math.sqrt(per_sqrt); 
			calc_display.value = operand_1;
		};
		if (operation_check == 1) {
			operand_2 = Math.sqrt(per_sqrt);
			calc_display.value = operand_2;
		}
		if (operation_check == 2) {
			operand_2 = Math.sqrt(per_sqrt); 
			calc_display.value = operand_2;};
	
	} else {
		func_error();
		calc_display.value = "Корень из x < 0 недопустим";
	}
	
	operation_check = 2;
}

// кнопка вычисления процентов
function func_percent () {
	var per_percent = Number(calc_display.value);
	
	if (operation_check == 2) {
		// operand_2 = 
	}
}
// функция ошибки. Блокирует все кнопки кроме сброса
function func_error() {
	for (var i=0; i<calc_buttons.length; i++) {
		calc_buttons[i].disabled = true;
	};
	document.getElementById('C').disabled = false;
};