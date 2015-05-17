'use strict';

var dustjs = require('adaro');
var express = require('express');
var session = require('express-session');
var easyimg = require('easyimage');
var multer = require('multer');
var bodyParser = require('body-parser');

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
	app.express.set('view engine', 'dust');	
	app.express.engine('dust', dustjs.dust({
		helpers: [
			'./helpers/dateformat',
			'./helpers/ismultiple'
		]
	}));


	app.express.set('views', __dirname + '/views/');
	
	configureAssets(app)
}

function configureAssets(app) {

	app.express.use('/resources', express.static(__dirname+'/resources'));
	app.express.use(app.opts.store, express.static(app.opts.store));
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
