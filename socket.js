/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, __dirname, require, module, User */

var Classes = require("./assets/js/classes");

var nextID = 1;
var connectedUsers = [];

// this function is called when a new user connects. Socket is a connection to this user
module.exports = function(socket) {
	
	var user = new Classes.User(nextID, "Guest " + nextID);
	nextID++;

	socket.emit('init', {
		user: user,
		users: connectedUsers
	});

	socket.on('message', function(data) {
		console.log("received: " + JSON.stringify(data));
	});
};