'use strict';

module.exports = defineModel;

function defineModel (dbCollection, entry, callback) {

	var MongoClient = require('mongodb').MongoClient;
	var ObjectID = require('mongodb').ObjectID;
	var assert = require('assert');

	var connection_url = 'mongodb://localhost:27017';

	MongoClient.connect(connection_url, function(err, db) {
		assert.equal(null, err);

		var collection = db.collection(dbCollection);

		collection.insert([
		    entry
		], function(err, result) {
			db.close();
		    callback(result);
		});
	});
}