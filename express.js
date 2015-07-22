'use strict';

var dustjs = require('adaro');
var express = require('express');
var session = require('express-session');
var multer = require('multer');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var knox = require('knox');
var MultiPartUpload = require('knox-mpu');
var easyimg = require('easyimage');

exports.configureExpress = configureExpress;

function configureExpress (app) {
	
	var MongoStore = require('connect-mongo')(session);
	
	app.express = express();
	app.express.use(session({
		cookie: {
			maxAge: 604800000 // 1 week
		},
		name: 'sess',
		resave: false,
		saveUninitialized: false,
		secret: app.opts.secret,
		store: new MongoStore({mongooseConnection: mongoose.connection})
	}));
	
	app.express.use( bodyParser.json() );
	app.express.use(bodyParser.urlencoded({
		extended: true
	}));
	app.express.set('view engine', 'dust');	
	app.express.engine('dust', dustjs.dust({
		helpers: [
			'./helpers/dateformat',
			'./helpers/ismultiple',
			'./helpers/substr'
		]
	}));


	app.express.set('views', __dirname + '/views/');
	
	configureAssets(app)
}

function configureAssets(app) {
	var client = knox.createClient({
		key: app.opts.s3_key,
		secret: app.opts.s3_secret,
		bucket: app.opts.s3_bucket
	});
	
	app.express.use('/resources', express.static(__dirname+'/resources'));
	app.express.use('/sitemap.xml', express.static(__dirname+'/sitemap.xml'));
	app.express.use(app.opts.store, express.static(app.opts.store));
	app.express.use(multer({
        dest: app.opts.store,
        rename: function (fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
		},
		onFileUploadComplete: function (file, req, res) {
			var upload = new MultiPartUpload({
				client: client,
				objectName: '/fullsize/'+file.name,
				file: file.path,
				headers: {'x-amz-acl': 'public-read'}
			});
			easyimg.rescrop({
				src:file.path, dst:app.opts.thumb_store + '/' + file.name,
				width:450, height:450,
				quality: 80,
				cropwidth:300, cropheight:300,
				x:0, y:0
			}).then(function(image) {
				var upload = new MultiPartUpload({
					client: client,
					objectName: '/thumbs/'+file.name,
					file: app.opts.thumb_store + '/' + file.name,
					headers: {'x-amz-acl': 'public-read'}
				});
			}, function (err) {
				console.log(err);
			});
			easyimg.resize({
				src:file.path, dst:app.opts.large_store + '/' + file.name,
				width:1200, height:1200,
			}).then(function(image) {
				var upload = new MultiPartUpload({
					client: client,
					objectName: '/large/'+file.name,
					file: app.opts.large_store + '/' + file.name,
					headers: {'x-amz-acl': 'public-read'}
				});
			}, function (err) {
				console.log(err);
			});
		}
	}));
	return app;
}
