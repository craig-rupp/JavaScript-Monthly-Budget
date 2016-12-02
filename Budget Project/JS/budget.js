'use strict';
//console.log('Ya boi');

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

	var data = {
		allItems : {
			exp : [],
			inc : []
		},
		total : {
			exp : 0,
			inc : 0
		}
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
		}
	}

})();

var UIController = (function(){
	var DOMStrings = {
		inputType : '.add__type',
		inputDesc : '.add__description',
		inputVal : '.add__value',
		inputBtn : '.add__btn'
	};

	return {
		getInput : function(){
			return {
			type : document.querySelector(DOMStrings.inputType).value, // Will be either inc or exp
			description : document.querySelector(DOMStrings.inputDesc).value, // input add description
			value : document.querySelector(DOMStrings.inputVal).value	// number value
			};
		},

		getDomStrings : function(){
			return DOMStrings;
		}
	};

})();


var appController = (function(budgetCtrl, UiCtrl){

	var setupEventListener = function (){

		var DOM = UiCtrl.getDomStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', controlAddItem);

		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
				controlAddItem();
			}
		});
	};


	var controlAddItem = function(){
			var input, newItem;
		//1. Get filed input data
			var input = UiCtrl.getInput();
			//console.log(input);

		//2. Add item to the budget controller
			var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		//3. Add item to the UI

		//4. Calculate the budget

		//5. Display the budget
	};

	return {
		init : function(){
			console.log('Application has started.');
			setupEventListener();
		}
	};

})(budgetController, UIController);

appController.init();

