// BUDGET CONTROLLER
var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
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
		expensesContainer: '.expenses__list'
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
				
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = domStrings.expensesContainer;
				
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			
			// replace the placeholder text with actual data
			newHtml = html.replace('%id', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			
			// insert the HTML into the DOM
			/*
				insertAdjacentHTML with 'beforeend' will insert all HTML as the last child of the element container
			*/
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
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
	};
	
	var updateBudget = function() {
		// 1. calculate the budget
		
		// 2. return the budget
		
		// 3. display the budget on the UI
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
		}
	};
	
	return {
		init: function() {
			console.log('BudgetApp has started!');
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();