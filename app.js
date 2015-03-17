var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');

var opts = {
	credentials: process.env.CREDENTIALS,
	db: process.env.DATABASE,
	secret: process.env.SECRET
};

initApp(opts);

function initApp() {
	var app = {};

	app.opts = opts;
	app.express = express();
	loadModels(app);
	configureApp(app);
	loadRoutes(app);
	startApp(app);

}

function configureApp (app) {
	app.express.use(session({
		cookie: {
			maxAge: 604800000 // 1 week
		},
		name: 'sess',
		resave: false,
		saveUninitialized: false,
		secret: app.opts.secret
	}));

	app.express.set('view engine', 'hbs');	
	app.express.engine('html', hbs.__express);
	app.express.use( bodyParser.json() );
	app.express.use(bodyParser.urlencoded({
		extended: true
	}));
	app.express.use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
		}
	}));

	app.express.use('/resources', express.static(__dirname+'/resources'));
	app.express.use('/uploads', express.static(__dirname+'/uploads'));
}

function loadModels (app) {
	require('./models/posts');

}

function loadRoutes (app) {

	var posts = require('./routes/admin/posts');
	var login = require('./routes/admin/login');
	var auth = require('./middleware/auth.js');

	app.express.get('/admin/posts', auth, posts.index);
	app.express.get('/admin/new-post/:id?',  auth, posts.new);
	app.express.get('/admin/delete-post/:id',  auth, posts.remove);
	app.express.post('/admin/add-post/:id?',  auth, posts.add);

	
	app.express.get('/admin/', login.index);
	app.express.get('/admin/login_failure', login.index);
	app.express.post('/admin/login', login.authenticate(app));

	/*
	require('./routes/admin/login')(app);
	require('./routes/admin/auth')(app);
	require('./routes/admin/create-post')(app);
	require('./routes/admin/add-post')(app);
	
	*/
}

function startApp (app) {
	var port = process.env.PORT || 3000;
	app.express.listen(port, function (err) {
		if(err) {
			console.error('App failed to start');
			console.error(err.stack);
			process.exit(1);
		}
		console.log( "App started on port " + port );
	});
}
