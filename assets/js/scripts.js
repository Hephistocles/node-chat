/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global angular, ChatController, SocketService */

// create an Angular module called chatTest with no dependent modules
var chatTest = angular.module('liveChat', []);

// register our controller within the chatTest module
chatTest.controller("chatController", ChatController);

// register our service wrapping around socket.io
chatTest.factory("socketService", SocketService);