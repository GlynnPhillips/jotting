'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');
var easyimg = require('easyimage');

exports.configureExpress = configureExpress;

function configureExpress (app) {
	
	app.express = express();
	app.express.use(session({
		cookie: {
			maxAge: 604800000 // 1 week
		},
		name: 'sess',
		resave: false,
		saveUninitialized: false,
		secret: app.opts.secret
	}));
	
	app.express.use( bodyParser.json() );
	app.express.use(bodyParser.urlencoded({
		extended: true
	}));
	
	configureAssets
}

function configureAssets(app) {

	app.express.use(multer({
        dest: app.opts.store,
        rename: function (fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
		},
		onFileUploadComplete: function (file, req, res) {
			easyimg.rescrop({
				src:file.path, dst:app.opts.thumb_store + '/' + file.name,
				width:400, height:400,
				cropwidth:300, cropheight:300,
				x:0, y:0
			}).then(function(image) {
				console.log(image);
			}, function (err) {
				console.log(err);
			});
		}
	}));


	return app;
}
