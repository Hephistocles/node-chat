/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, __dirname, require, module, User */

var Classes = require("./assets/js/classes");

var nextID = 1;
var serverUser = new Classes.User(0, "ServerBot");
var connectedUsers = [];
connectedUsers[0] = serverUser;

// this function is called when a new user connects. Socket is a connection to this user
module.exports = function(socket) {
	var localID = nextID++;
	var user = new Classes.User(localID, "Guest " + localID);
	connectedUsers[localID] = user;
	// socket.set(nextID);
	// nextID++;

	socket.emit('init', {
		user: user,
		users: connectedUsers
	});

	socket.broadcast.emit('newuser', {user:user});
	socket.broadcast.emit('message', {user:user, text:"I have joined the room."});

	socket.on('namechange', function(data) {
		connectedUsers[localID].name = data.name;
		socket.broadcast.emit('namechange', {id:localID, name:data.name});
	});

	socket.on('typemessage', function(data) {
		console.log("received: " + JSON.stringify(data));
		socket.broadcast.emit('typemessage', data.message);
	});

	socket.on('message', function(data) {
		socket.broadcast.emit('message', data.message);
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('message', new Classes.Message(connectedUsers[localID], "I have disconnected."));
		delete connectedUsers[localID];
		socket.broadcast.emit('disconnection', {id:localID});
	});
};