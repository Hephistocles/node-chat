/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global angular, console, alert, Classes, NameService, SocketService */

// create a module called chatTest with no dependent modules
// a module is sort of like a namespace 
var chatTest = angular.module('chatTest', []);


// create services
// a service tends to be stateless and just have functions
// services provide back-end logic and transformations for data
chatTest.factory("nameService", NameService);
chatTest.factory("socketService", SocketService);

// create a controller within the chatTest module
// a controller links the model (contained in $scope) to the view
// $scope refers to data bound to the view
// can pass in other services as dependencies (by adding parameters to the function)
function ChatController($scope, nameService, socketService) {
	// define event handlers first
	// deal with new messages
	$scope.sendMessage = function() {
		var newMsg = $scope.currentMessage.clone();
		socketService.emit('message', {message:newMsg});
		$scope.messages.push(newMsg);
		$scope.currentMessage.text = "";
	};

	// deal with name changing
	$scope.typeMessage = function() {
		// $scope.currentMessage = new Classes.Message($scope.localUser, $scope.message);
	};

	// receive assigned user ID, and current list of users
	socketService.on('init', function(data) {
		console.log(data);
		$scope.localUser = data.user;
		$scope.users = data.users;
		$scope.currentMessage = new Classes.Message($scope.localUser, "");
	});
	
	// initialise properties	
	// deal with room name
	$scope.roomname = "";
	$scope.messages = [];
	// $scope.localName = "New User";
	// $scope.localUser = new Classes.User($scope.localName);
	$scope.users = [];

	// initialise properties data
	nameService.getRoomName().success(function(data) {
		console.log(data);
		if (!data.error)
			$scope.roomname = data.name;
	});
}
chatTest.controller("chatController", ChatController);