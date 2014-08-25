/*jshint bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global io */

// write a wrapping service simplifying the socket.io api
function SocketService($rootScope) {
	var socket = io.connect();

	// our service only wraps the on and emit parts of socket.io
	return {
		// we will call this function to register event handlers
		on: function(eventName, callback) {
			socket.on(eventName, function() {

				// we don't know what arguments are passed to this event so use the arguments object
				var args = arguments;
				
				// we call $apply to tell Angular it may need to update templates after running this
				$rootScope.$apply(function () {

					// finally call the actual callback with the event arguments
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