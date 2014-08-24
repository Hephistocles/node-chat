/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, __dirname, require, module */

module.exports = {};

var app = module.parent.exports.app;
var express = module.parent.exports.express;
var api = require("./api");

// serve a home page on the root url
app.get('/', function(req, res) {
	res.render("chat.html");
});

// serve the stats page when requested, which is contained in /views/stats.html
app.get('/stats', function(req, res) {

	// render stats.html from the views folder using ejs
	res.render("stats.html");
});

/* API REQUESTS */

function processResult(res) {
	return function(success, data) {
		// TODO: probably do something other than this...
		if (success) {
			res.json(data);
		} else {
			res.json({error: true, data:data});
		}
	};
}

// get random chat name
app.get('/api/name', function(req, res) {
	// get a random room name
	api.getRandomName(processResult(res));

});

// get chatrooms by room name. Optional JSON body allows date filtering
app.get('/api/log/:roomname/?', function(req, res) {

});

// add a new chatlog item
app.post('/api/log/:roomname/?', function(req, res) {

});

// serve static files in the 'res' folder from the root directly
app.use('/', express.static(__dirname + '/assets'));