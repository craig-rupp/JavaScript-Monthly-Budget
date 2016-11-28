'use strict';

console.log('Let\'s work on objects!');

//Function Constructor

var John = {
	name : 'John',
	yearOfBirth : 1990,
	job : 'developer'
};

var Person = function(name, yearOfBirth, job) {
	this.name = name;
	this.yearOfBirth = yearOfBirth;
	this.job = job;
}

var craig = new Person('Craig', 1990, 'software dev');

console.log(craig);

Person.prototype.calculateAge =
function (){
	console.log(2016 - this.yearOfBirth);
}

Person.prototype.lastName = 'Rupp';

var Lisa = new Person('Lisa', 1963, 'CCN');

Lisa.calculateAge();
console.log(Lisa.lastName);