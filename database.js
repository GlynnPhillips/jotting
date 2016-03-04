'use strict';

const mongoose = require('mongoose');

module.exports.databaseConnection = (app, done) => {
	const models = require('./models/posts');
	models.configureModels();
	mongoose.connect(app.opts.db, done);
};

module.exports.databaseCloseConnection = () => {
	mongoose.disconnect();
};
