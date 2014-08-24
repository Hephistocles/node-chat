/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, __dirname, require, module */

var WORDNIK_API_KEY = "a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
var WORDNIK_BASE_URL = "http://api.wordnik.com:80/v4/";

var request = require("request");


module.exports = {

	getRandomName: function(callback) {
		// chatroom names are made up of a random adjective and a random animal
		var adjective = null;
		var animals = null;
		var cancelled = false;
		var finish = function() {
			// FIXME: concurrency bug?
			if (cancelled) return;

			// we only want to finish once
			cancelled = true;
			var roomname = adjective + " " + animals;
			// change to title case
			roomname = roomname.replace(/\w+/g, function(txt) {
				return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
			});
			callback(true, {
				name: roomname
			});
		};

		// send the adjective request
		request({
			url: WORDNIK_BASE_URL + "words.json/randomWord",
			json: true,
			qs: {
				minCorpusCount: 1000,
				minDictionaryCount: 3,
				hasDictionaryDef: true,
				includePartOfSpeech: "adjective",
				api_key: WORDNIK_API_KEY
			}
		}, function(error, response, body) {
			if (cancelled) return;

			if (!error && response.statusCode === 200) {
				adjective = body.word;
				// only finish once we have received both parts of data
				if (animals !== null) {
					finish();
				}
			} else {
				// if we send a failure callback here, then we must stop the other callback firing
				cancelled = true;
				callback(false, body);
			}
		});

		// send the animal request (just fetch from local file)
		try {
			var animalObj = require('./assets/data/animals.json');
			animals = animalObj.animals[Math.floor(Math.random() * animalObj.animals.length)];

			// only finish once we have received both parts of data
			if (adjective !== null) {
				finish();
			}
		} catch (error) {
			if (cancelled) return;

			// if we send a failure callback here, then we must stop the other callback firing
			cancelled = true;
			callback(false, error);
		}
	}

};