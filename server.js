/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, require, module, console, setTimeout */

var express = require("express");
var app = express();

// make the "app" and "express" variables visible from outside the module. 
module.exports.app = app;
module.exports.express = express;

// set the default directory for templated pages
app.set("views", __dirname + "/views");

// set the default template engine to ejs - although I'm only using it for static html anyway
// note that that we don't register an engine for jade files. 
// I guess node knows the default renderer for .jade files but not for .html files.
app.engine("html", require('ejs').renderFile);

require("./routes");

// any requested page not routed by the above should result in a 404
app.get('/*',function(req, res) {
	res.send("404 Page not found");
});

// listen on port 8000
app.listen(8000);