/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global angular, console, alert */

// create a module called chatTest with no dependent modules
// a module is sort of like a namespace 
var chatTest = angular.module('chatTest', []);

// create a controller within the chatTest module
// a controller links the model (contained in $scope) to the view
// $scope refers to data bound to the view
// can pass in other services as dependencies (by adding parameters to the function)
function ChatController($scope, nameService) {
	// deal with room name
	$scope.roomname = "";
	nameService.getRoomName().success(function(data) {
		console.log(data);
		if (!data.error)
			$scope.roomname = data.name;
	});

	// bind the messages item
	$scope.messages = [];

	$scope.localUser = new User("Test");
	$scope.users = [$scope.localUser];

	// deal with new messages
	$scope.sendMessage = function() {
		var newMsg = new Message($scope.localUser, $scope.message);
		$scope.messages.push(newMsg);
		$scope.message = "";
		$scope.typeMessage();
	};

	// deal with name changing
	$scope.changeName = function() {
		$scope.localUser.name = $scope.localName;
		$scope.typeMessage();
	};

	// deal with name changing
	$scope.typeMessage = function() {
		$scope.currentMessage = new Message($scope.localUser, $scope.message);
	};
}
chatTest.controller("chatController", ChatController);

// create a service 
// a service tends to be stateless and just have functions
// services provide back-end logic and transformations for data
function NameService($http) {
	return {
		getRoomName: function() {
			return $http.get("/api/name");
		}
	};
}
chatTest.factory("nameService", NameService);

// create a User class
function User(name) {
	this.name = name;
}

// create a Message class
function Message(user, message) {
	this.text = message;
	this.user = user;
}