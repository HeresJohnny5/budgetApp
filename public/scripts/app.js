// BUDGET CONTROLLER
var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};
	
	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};
	
	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};
	
	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(curr) {
			sum += curr.value;
		});
		
		data.totals[type] = sum;
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		
		totals: {
			exp: 0,
			inc: 0
		},
		
		budget: 0,
		percentage: -1 // percentage is set to -1 if there are no budget values or expenses
	};
	
	return {
		addItem: function(type, des, val) {
			var newItem, ID;
			
			// CREATE NEW ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			
			// CREATE NEW ITEM BASED ON 'inc' or 'exp'
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}
			
			// PUSH INTO DATA STRUCTURE
			data.allItems[type].push(newItem); // type will either be exp or inc
			
			// RETURN NEW ELEMENT
			return newItem;
		},
		
		deleteItem: function(type, id) {
			var ids, index;
			
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});
			
			index = ids.indexOf(id);
						
			if (index !== -1) {
				data.allItems[type].splice(index, 1); 
				// the first argument is the position number you want to start deleting
				// the second argument is the number of elements that you want to delete
			}
		},
		
		calculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			
			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			
			// calculate the percentage that is spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},
		
		calculatePercentages: function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},
		
		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(cur) {
				return cur.getPercentage();
			});
			
			return allPerc;
		},
		
		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},
		
		testing: function() {
			console.log(data);
		}
	};
})();

// UI CONTROLLER
var UIController = (function() {
	var domStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};
	
	var formatNumber = function(num, type) {
		var numSplit, int, dec, sign;
			
		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};
	
	var nodeListForEach = function(list, callback) {
				for (var i = 0; i < list.length; i++) {
					callback(list[i], i);
				}
	};
	
	return {
		getInput: function() {			
			return {
				type: document.querySelector(domStrings.inputType).value, // will be either inc or exp
				description: document.querySelector(domStrings.inputDescription).value,
				value: parseFloat(document.querySelector(domStrings.inputValue).value)
			};
			// returning a object is a good way to return multiple variables
		},
		
		addListItem: function(obj, type) {
			var html, newHtml, element;
			
			// create HTML string with placeholder text
			if (type === 'inc') {
				element = domStrings.incomeContainer;
				
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = domStrings.expensesContainer;
				
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			// replace the placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			
			// insert the HTML into the DOM
			/*
				insertAdjacentHTML with 'beforeend' will insert all HTML as the last child of the element container
			*/
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
		
		deleteListItem: function(selectorID) {
			var el = document.getElementById(selectorID);
			
			el.parentNode.removeChild(el);
			// in javaScript you can only remove a child
		},
		
		clearFields: function() {
			var fields, fieldsArr;
			
			// querySelectorAll returns a list, which is similiar to an array, but different
			fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);
			
			// convert list to an array
			fieldsArr = Array.prototype.slice.call(fields);
			
			fieldsArr.forEach(function(curr, index, arr) {
				curr.value = "";
			});
			
			fieldsArr[0].focus();
		},
		
		displayBudget: function(obj) {
			var type;
			
			obj.budget > 0 ? type = 'inc' : type = 'exp';
			
			document.querySelector(domStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(domStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(domStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			
			if (obj.percentage > 0) {
				document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(domStrings.percentageLabel).textContent = '---';

			}
		},
		
		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(domStrings.expensesPercLabel);
			
			nodeListForEach(fields, function(cur, index) {
				if (percentages[index] > 0) {
					cur.textContent = percentages[index] + '%';
				} else {
					cur.textContent = '---';
				}
			});
		},
		
		displayDate: function() {
			var now, months, month, year;
			
			now = new Date();
			
			months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			
			month = now.getMonth();
			year = now.getFullYear();
			document.querySelector(domStrings.dateLabel).textContent = months[month + 1] + ' ' + year;			
		},
		
		changedType: function() {
			var fields = document.querySelectorAll(
				domStrings.inputType + ',' + 
				domStrings.inputDescription + ',' +
				domStrings.inputValue
			);
			
			nodeListForEach(fields, function(cur) {
				cur.classList.toggle('red-focus');
			});
			
			document.querySelector(domStrings.inputButton).classList.toggle('red');
		},
		
		getDomStrings: function() {
			return domStrings;
		}
	};
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
	var setupEventListeners = function() {
		var dom = UICtrl.getDomStrings();
		
		document.querySelector(dom.inputButton).addEventListener('click', ctrlAddItem);
	
		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				event.preventDefault();
				ctrlAddItem();
			}	
		});
		
		document.querySelector(dom.container).addEventListener('click', ctrlDeleteItem);
		
		document.querySelector(dom.inputType).addEventListener('change', UICtrl.changedType);
	};
	
	var updateBudget = function() {
		// 1. calculate the budget
		budgetCtrl.calculateBudget();
		
		// 2. return the budget
		var budget = budgetCtrl.getBudget();
		
		// 3. display the budget on the UI
		UIController.displayBudget(budget);
	};
	
	var updatePercentages = function() {
		// 1. calculate percentages
		budgetCtrl.calculatePercentages();
		
		// 2. read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		
		// 3. update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	};
		
	var ctrlAddItem = function() {
		var input, newItem;
		
		// 1. get the field input data
		input = UICtrl.getInput();
		
		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. add the item to the budget
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		
			// 3. add the item to the UI
			UIController.addListItem(newItem, input.type);
		
			// 4. clear the fields
			UIController.clearFields();
		
			// 5. calculate and update budget
			updateBudget();	
			
			// 6. calculate and update percentages
			updatePercentages();
		}
	};
	
	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;
		
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
			
			// 1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);
			
			// 2. delete the item from the UI
			UICtrl.deleteListItem(itemID);
			
			// 3. update and show the new budget
			updateBudget();
			
			// 4. calculate and update percentages
			updatePercentages();
		}
	};
	
	return {
		init: function() {
			console.log('BudgetApp has started!');
			UIController.displayDate();
			UIController.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();