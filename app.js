'use strict'

var express = require('express');
var startApplication = require('./start.js');
var opts = {
	credentials: process.env.CREDENTIALS,
	db: process.env.MONGO_URL,
	secret: process.env.SECRET,
	store: process.env.CLOUD_DIR || __dirname + '/uploads',
	port: process.env.PORT || 3000
};

opts.thumb_store = opts.store + '/thumbs';

startApplication(opts, function (err, app) {
	if(err) {
		throw (err);	
	}

	console.log('Jotting is now running on port ' + opts.port);
});
