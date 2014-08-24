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

	// deal with new messages
	$scope.sendMessage = function() {
		$scope.messages.push($scope.message);
		$scope.message = "";
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