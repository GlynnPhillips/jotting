'use strict';

module.exports = startApplication;

var configureExpress = require('./express').configureExpress;

function startApplication(opts, done) {
	var app = {};
	
	app.opts = opts;
	configureExpress(app);

	done(null, app)
}
