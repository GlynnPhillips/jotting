'use strict';

const mongoose = require('mongoose');

module.exports.databaseConnection = (app, done) => {
	mongoose.connect(app.opts.db, done);
}
