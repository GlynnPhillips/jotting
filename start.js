'use strict';

const configureExpress = require('./express').configureExpress;
const databaseConnection = require('./database').databaseConnection;
const loadRoutes = require('./routes').loadRoutes;
const configureModels = require('./models/posts').configureModels;

module.exports = (opts, done) => {
	const app = {};

	app.opts = opts;

	databaseConnection(app, (err) => {
		if (err) {
			return done(err);
		}

		configureExpress(app);
		configureModels(app);
		loadRoutes(app);

		app.express.listen(app.opts.port, (err) => {
			if (err) {
				console.error('App failed to start');
				console.error(err.stack);
				process.exit(1);
			}
		});

		done(null, app);

	});
};
