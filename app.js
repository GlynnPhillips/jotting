'use strict'

var express = require('express');
var startApplication = require('./start.js');
var opts = {
	credentials: process.env.CREDENTIALS,
	db: process.env.MONGO_URL,
	secret: process.env.SECRET,
	store: process.env.TEMP_DIR || __dirname + '/uploads',
	image_path: process.env.image_path,
	port: process.env.PORT || 3000,
	s3_key : process.env.s3_key,
	s3_bucket: process.env.s3_bucket,
	s3_secret: process.env.s3_secret
};

opts.thumb_store = opts.store + '/thumbs';
opts.large_store = opts.store + '/large';
opts.admin_store = opts.store + '/admin';

startApplication(opts, function (err, app) {
	if(err) {
		throw (err);	
	}

	console.log('Jotting is now running on port ' + opts.port);
});





