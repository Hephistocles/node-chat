/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, require, module */
var express = require("express");
var app = express();

// make the app and express variables visible from outside the module. 
module.exports.app = app;
module.exports.express = express;

// set the default directory for templated pages
app.set("views", __dirname + "/views");

// set the default template engine to ejs - although I'm only using it for static html anyway
app.engine("html", require('ejs').renderFile);

// I have put routing code in another file for tidiness. The .js suffix is implicit
require("./routes");

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
	res.send("404 Page not found");
});

// create a new http server for socket.io to bind to
var server = require("http").Server(app);
var io = require("socket.io")(server);

// our socket code is contained in socket.js
// after including this, socket is a function which we use as a handler on connection
var socket = require("./socket");
io.on('connection', socket);

// listen on port 8000
// note that we could call app.listen, but this wouldn't start the socket.io server
server.listen(80);