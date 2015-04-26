'use strict';

module.exports = startApplication;

var configureExpress = require('./express').configureExpress;

function startApplication(opts, done) {
	var app = {};
	
	app.opts = opts;
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
}


