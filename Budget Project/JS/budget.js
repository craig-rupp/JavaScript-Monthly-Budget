'use strict';
//console.log('Ya boi');
//budget Controller
var budgetController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type){
		var sum = 0;
		data['allItems'][type].forEach(function(cur){
			//sum = sum + cur.value;
			sum += cur.value;
		});
		data.total[type] = sum;
	};

	var data = {
		allItems : {
			exp : [],
			inc : []
		},
		total : {
			exp : 0,
			inc : 0
		},
		budget : 0,
		percentage : -1
	};	

	return {
		addItem : function(type, des, val) {
			var newItem, ID;

			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//creatae new item based on 'exp' or 'inc' type
			if(type === 'exp'){
				newItem = new Expense(ID, des, val);
				console.log(newItem);
			} else if (type === 'inc'){
				newItem = new Income(ID, des, val);
			}
			//push into our data structure
			data.allItems[type].push(newItem);
			return newItem;
		},
		testing : function() {
			console.log(data);
		},
		calculateBudget : function(){
			//calculate total income & expenses
			calculateTotal('inc');
			calculateTotal('exp');

			//calc the budget inc - exp
			data.budget = data.total['inc'] - data.total.exp

			//calc % of income we have spent
			if(data.total['inc'] > 0){
				data.percentage = Math.round((data.total['exp'] / data.total['inc']) * 100);
			} else {
				data['percentage'] = -1;
			}
		},
		getBudget : function(){
			return {
				budget : data.budget,
				totalInc : data.total.inc,
				totalExp : data.total.exp,
				percentage : data.percentage
			};
		}
	}

})();

//UI Controller
var UIController = (function(){
	var DOMStrings = {
		inputType : '.add__type', 
		inputDesc : '.add__description',
		inputVal : '.add__value',
		inputBtn : '.add__btn',
		incomeContainer : '.income__list',
		expensesContainer : '.expenses__list',
		budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container : '.container'
	};

	return {
		getInput : function(){
			return {
			type : document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
			description : document.querySelector(DOMStrings.inputDesc).value, // input add description
			value : parseFloat(document.querySelector(DOMStrings.inputVal).value)	// number value
			};
		},

		getDomStrings : function(){
			return DOMStrings;
		},

		addListItem : function(object, type){
			var html, newHTML, element;
			// HTML String w/placeholder item
			 if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
			//replace placeholder text with data
			newHTML = html.replace('%id%', object.id);
			newHTML = newHTML.replace('%description%', object.description);
			newHTML = newHTML.replace('%value%', object.value);
			//Insert HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

		},

		clearFields : function(){
			var fields;
			fields = document.querySelectorAll(DOMStrings.inputDesc + ', ' + DOMStrings.inputVal);
			//returns list, use array global object to slice (turn fields into array)
			var fieldsArray = Array.prototype.slice.call(fields);
			//foreach through each value and set to empty string
			fieldsArray.forEach(function(current,index,array){
				current.value = "";
				//console.log(current);
				//console.log(index);
			});
			//return focus to first 'description, input value'
			fieldsArray[0].focus();
		},

		displayBudget : function(obj){
			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

			if(obj.percentage > 0){
				document.querySelector(DOMStrings['percentageLabel']).textContent = obj.percentage + '%';				
			} else {
				document.querySelector(DOMStrings['percentageLabel']).textContent = '---';
			}
		}
	};

})();

//GLOBAL APP Controller
var appController = (function(budgetCtrl, UiCtrl){

	var setupEventListener = function (){

		var DOM = UiCtrl.getDomStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', controlAddItem);

		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
				controlAddItem();
			}
		});
		document.querySelector(DOM.container).addEventListener('click', controlDelItem);
	};

	var updateBudget = function(){
		//1. Calc Budget

		budgetCtrl.calculateBudget();

		//2. Return the Budget
		var budget = budgetCtrl.getBudget();

		//3. Display budget on the UI
		UiCtrl.displayBudget(budget);
	}

	var controlAddItem = function(){
			var input, newItem;
		//1. Get filed input data
			var input = UiCtrl.getInput();
			//console.log(input);

			if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//2. Add item to the budget controller
				var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. Add item to the UI
				UiCtrl.addListItem(newItem, input.type);

			//4. Clear the fields
				UiCtrl.clearFields();
			
			//5. Calculate the budget
				updateBudget();	
			}

		//6. Display the budget
			//UiCtrl.displayBudget(input);
	};

	var controlDelItem = function(event){
		var item_id = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(item_id){
			//inc-1
			var splitID = item_id.split('-');
			console.log(splitID);
		}
	}

	return {
		init : function(){
			console.log('Application has started.');
			UiCtrl.displayBudget({
				budget : 0,
				totalInc : 0,
				totalExp : 0,
				percentage : -1
			});
			setupEventListener();
		}
	};

})(budgetController, UIController);

appController.init();

