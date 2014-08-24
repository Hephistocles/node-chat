/*jshint bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global io */

function NameService($http) {
	return {
		getRoomName: function() {
			return $http.get("/api/name");
		}
	};
}

// write a wrapping service simplifying the socket.io api
function SocketService($rootScope) {
	var socket = io.connect();
	
	return {
		// we will call this function to register event handlers
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				
				// we call $apply to tell Angular it may need to update templates after running this
				$rootScope.$apply(function () {

					// finally call the actual callback with given arguments
					callback.apply(socket, args);
				});
			});
		},
		// we will call this function to speak to the server
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					// the callback is optional, and is fired after emitting the event
					if (callback) {
						callback.apply(socket.args);
					}
				});
			});
		}
	};
}