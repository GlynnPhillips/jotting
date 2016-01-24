'use strict';

module.exports.databaseConnection = databaseConnection;

const mongoose = require('mongoose');

function databaseConnection(app, done) {
	mongoose.connect(app.opts.db, done);
}
