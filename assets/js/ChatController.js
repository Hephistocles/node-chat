/*jshint bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global Classes */

function ChatController($scope, socketService) {

	// initialise properties
	// properties of $scope are tied to ng- attributes in the html
	$scope.messages = [];
	$scope.currentMessages = [];
	$scope.users = [];

	// define scope methods
	// methods of $scope are tied to ng-change and ng-submit events

	// send a message on submit to all other members
	$scope.sendMessage = function() {
		// only send non-trivial messages
		if ($scope.currentMessage.text.length < 1)
			return;

		// construct a Message object (by cloning the in-progress one) and send it to the server
		var newMsg = $scope.currentMessage.clone();
		socketService.emit('message', {
			message: newMsg
		});

		// add message to our local view, and reset the form
		$scope.messages.push(newMsg);
		$scope.currentMessage.text = "";
		$scope.typeMessage();
	};

	// name changes and typing updates are trivial - just notify the server of the event
	$scope.changeName = function() {
		socketService.emit('namechange', {
			name: $scope.localUser.name
		});
	};
	$scope.typeMessage = function() {
		socketService.emit('typemessage', {
			message: $scope.currentMessage
		});
	};

	// define event handlers for when this client receives updates from the server
	
	// on initialise, receive current list of users and initialise the client based on that
	socketService.on('init', function(data) {
		$scope.users = data.users;
		$scope.localUser = $scope.users[data.user.id];
		$scope.currentMessage = new Classes.Message($scope.localUser, "");
	});

	// on new message or new user updates, simply update our list of users
	socketService.on('newuser', function(data) {
		$scope.users[data.user.id] = data.user;
	});

	socketService.on('message', function(data) {

		// replace the user with our local version (so we can update names)
		data.user = $scope.users[data.user.id];
		$scope.messages.push(data);
	});

	socketService.on('typemessage', function(data) {

		// replace the user with our local version (so we can update names)
		data.user = $scope.users[data.user.id];
		$scope.currentMessages[data.user.id] = data;
	});

	// update the appropriate user's name in our list
	socketService.on('namechange', function(data) {
		$scope.users[data.id].name = data.name;
	});

	// clean up when a user disconnects
	socketService.on('disconnection', function(data) {
		// don't delete the user because otherwise all their old messages will be orphaned
		// but do delete any in-progress messages they still have
		delete $scope.currentMessages[data.id];
	});
}