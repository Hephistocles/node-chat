/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global angular, console, alert, Classes, NameService, SocketService */

// create a module called chatTest with no dependent modules
// a module is sort of like a namespace 
var chatTest = angular.module('chatTest', []);


// create services
// a service tends to be stateless and just have functions
// services provide back-end logic and transformations for data
chatTest.factory("socketService", SocketService);

// create a controller within the chatTest module
// a controller links the model (contained in $scope) to the view
// $scope refers to data bound to the view
// can pass in other services as dependencies (by adding parameters to the function)
function ChatController($scope, socketService) {
	// define event handlers first
	// deal with new messages
	$scope.sendMessage = function() {
		if ($scope.currentMessage.text.length < 1)
			return;
		var newMsg = $scope.currentMessage.clone();
		socketService.emit('message', {
			message: newMsg
		});
		$scope.messages.push(newMsg);
		$scope.currentMessage.text = "";
		$scope.typeMessage();
	};

	// deal with name changing
	$scope.typeMessage = function() {

		socketService.emit('typemessage', {
			message: $scope.currentMessage
		});
	};
	// deal with name changing
	$scope.changeName = function() {
		socketService.emit('namechange', {
			name: $scope.localUser.name
		});
	};

	// receive assigned user ID, and current list of users
	socketService.on('init', function(data) {
		console.log(data);
		$scope.users = data.users;
		$scope.localUser = $scope.users[data.user.id];
		$scope.currentMessage = new Classes.Message($scope.localUser, "");
	});

	socketService.on('newuser', function(data) {
		$scope.users[data.user.id] = data.user;
	});

	// receive assigned user ID, and current list of users
	socketService.on('message', function(data) {

		// replace the user with our local version (so we can update names)
		data.user = $scope.users[data.user.id];
		$scope.messages.push(data);
		console.log(data);
	});

	// receive assigned user ID, and current list of users
	socketService.on('typemessage', function(data) {

		// replace the user with our local version (so we can update names)
		data.user = $scope.users[data.user.id];
		$scope.currentMessages[data.user.id] = data;
	});

	socketService.on('namechange', function(data) {
		$scope.users[data.id].name = data.name;
	});

	socketService.on('disconnection', function(data) {
		// don't delete the user because otherwise all their old messages will be orphaned
		// delete $scope.users[data.id];
	});

	// initialise properties
	$scope.messages = [];
	$scope.currentMessages = [];
	$scope.users = [];
}
chatTest.controller("chatController", ChatController);