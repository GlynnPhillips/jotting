'use strict';

module.exports = startApplication;

var configureExpress = require('./express').configureExpress;
var databaseConnection = require('./database').databaseConnection;


function startApplication(opts, done) {
	var app = {};
	
	app.opts = opts;

	databaseConnection(app, function(err) {
		if(err) {
			return done(err);
		}

		configureExpress(app);

		app.express.listen(app.opts.port, function (err) {
			if(err) {
				console.error('App failed to start');
				console.error(err.stack);
				process.exit(1);
			}
			console.log( "App started on port " + app.opts.port );
		});

		done(null, app)

	});
}


