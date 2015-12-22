'use strict';
var dust = require('dustjs-linkedin');
var cons = require('consolidate');
var express = require('express');
var session = require('express-session');
var multer = require('multer');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

exports.configureExpress = configureExpress;

function configureExpress (app) {
	
	var MongoStore = require('connect-mongo')(session);
	
	var dateformat = require('./helpers/dateformat');
	var isMultple = require('./helpers/ismultiple');
	var substr = require('./helpers/substr');

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
	
	app.express.use(bodyParser.json());
	app.express.use(bodyParser.urlencoded({
		extended: true
	}));
	
	app.express.engine('dust', cons.dust);
	cons.dust.helpers = require('dustjs-helpers');
	app.express.set('view engine', 'dust');
	app.express.set('views', __dirname + '/views/');


	configureAssets(app)
}

function configureAssets(app) {
	var upload = multer({ dest: app.opts.store });
	app.express.use('/resources', express.static(__dirname+'/resources'));
	app.express.use('/sitemap.xml', express.static(__dirname+'/sitemap.xml'));
	app.express.use(app.opts.store, express.static(app.opts.store));
	return app;
}
