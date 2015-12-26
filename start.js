'use strict';

module.exports = startApplication;

var configureExpress = require('./express').configureExpress;
var databaseConnection = require('./database').databaseConnection;
var loadRoutes = require('./routes').loadRoutes;
var configureModels = require('./models/posts').configureModels;

function startApplication(opts, done) {
	var app = {};
	
	app.opts = opts;

	databaseConnection(app, function(err) {
		if(err) {
			return done(err);
		}

		configureExpress(app);
		configureModels(app);
		loadRoutes(app);

		app.express.listen(app.opts.port, function (err) {
			if(err) {
				console.error('App failed to start');
				console.error(err.stack);
				process.exit(1);
			}
		});

		done(null, app);

	});
}


