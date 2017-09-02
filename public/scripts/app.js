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
	}
	
	return {
		addItem: function(type, des, val) {
			var newItem, ID;
			
			// CREATE NEW ID
			if(data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			
			// CREATE NEW ITEM BASED ON 'inc' or 'exp'
			if(type === 'exp') {
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
		inputButton: '.add__btn'
	};
	
	return {
		getInput: function() {			
			return {
				type: document.querySelector(domStrings.inputType).value, // will be either inc or exp
				description: document.querySelector(domStrings.inputDescription).value,
				value: document.querySelector(domStrings.inputValue).value
			};
			// returning a object is a good way to return multiple variables
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
			if(event.keyCode === 13 || event.which === 13) {
				event.preventDefault();
				ctrlAddItem();
			}	
		});	
	};
		
	var ctrlAddItem = function() {
		var input, newItem;
		
		// 1. Get the field input data
		input = UICtrl.getInput();
		console.log(input);
		
		// 2. Add the item to the budget
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		
		// 3. Add the item to the uI
		// 4. Calculate the budget
		// 5. Display the budget on the UI
	};
	
	return {
		init: function() {
			console.log('BudgetApp has started!');
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();