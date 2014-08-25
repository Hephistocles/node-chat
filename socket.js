/* jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, require, module */

// Classes contains models for Users and Messages
var Classes = require("./assets/js/classes");

// counter for clients. We'll just count up from 1 and never reset
var nextID = 1;
var connectedUsers = [];

// this function is called when a new user connects. 
// socket is a connection particularly to this user
module.exports = function(socket) {

	// select an ID and create a new User for this connection
	var localID = nextID++;
	var user = new Classes.User(localID, "Guest " + localID);
	connectedUsers[localID] = user;

	// tell the client about it's assigned users, and the other connected users
	socket.emit('init', {
		user: user,
		users: connectedUsers
	});

	// tell other users about this new connection
	socket.broadcast.emit('newuser', {
		user: user
	});
	socket.broadcast.emit('message', new Classes.Message(user, "I have joined the room."));

	// register handlers for events coming in on this socket

	// triggered when this users' name changes (which happens live char-by-char)
	// update local representation, then notify everyone else of the change
	socket.on('namechange', function(data) {
		connectedUsers[localID].name = data.name;
		socket.broadcast.emit('namechange', {
			id: localID,
			name: data.name
		});
	});

	// simply notify everyone else when we have an incoming message event
	socket.on('message', function(data) {
		socket.broadcast.emit('message', data.message);
	});

	// we have a separate procedure for displaying messages still in the process of being typed
	// as such, register a different event but otherwise treat like a normal message
	socket.on('typemessage', function(data) {
		socket.broadcast.emit('typemessage', data.message);
	});

	// like for the initial connection, notify everyone else and update our representation
	socket.on('disconnect', function() {
		socket.broadcast.emit('message', new Classes.Message(connectedUsers[localID], "I have disconnected."));
		socket.broadcast.emit('disconnection', {id:localID});
		delete connectedUsers[localID];
	});
};