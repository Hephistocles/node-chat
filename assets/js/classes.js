/*jshint bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global angular, console, alert, User, Message, NameService, exports */

// I want to re-use these model classes on both the server and the client. 
// in Node.JS I will be adding them to the module.exports object
// on the client, they will be in a custom global object called "Classes"
// we call this function, passing container as either module.exports or the Classes object
(function(container) {
	
	// define a User class
	container.User = function(id, name) {
		this.id = id;
		this.name = name;
	};

	// create a Message class with a clone method
	container.Message = function(user, message) {
		this.text = message;
		this.user = user;
	};
	container.Message.prototype.clone = function() {
		return new container.Message(this.user, this.text);
	};

})((typeof exports === 'undefined') ? // exports is only defined on server
	(this.Classes = this.Classes || {}) // init Classes if necessary
	: exports);