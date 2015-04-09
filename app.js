var express = require('express');
var dustjs = require('adaro');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var fs = require('fs');
var easyimg = require('easyimage');

var opts = {
	credentials: process.env.CREDENTIALS,
	db: process.env.MONGO_URL,
	secret: process.env.SECRET,
	store: process.env.CLOUD_DIR || __dirname + '/uploads',
};

opts.thumb_store = opts.store + '/thumbs';

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

	app.express.set('view engine', 'dust');	
	app.express.engine('dust', dustjs.dust({
		layout: 'layout', 
		helpers: [
			'./helpers/dateformat'
		]
	}));
	app.express.set('views', __dirname + '/views/');
	
	app.express.use( bodyParser.json() );
	app.express.use(bodyParser.urlencoded({
		extended: true
	}));
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

	console.log(dustjs.dust);

	app.express.use('/resources', express.static(__dirname+'/resources'));
	app.express.use(app.opts.store, express.static(app.opts.store));
}

function loadModels (app) {
	require('./models/posts')(app);

}

function loadRoutes (app) {

	var admin_posts = require('./routes/admin/posts');
	var login = require('./routes/admin/login');
	var auth = require('./middleware/auth.js');

	var posts = require('./routes/posts');
	var pages = require('./routes/pages');


	app.express.get('/admin/posts', auth, admin_posts.index);
	app.express.get('/admin/new-post/:id?',  auth, admin_posts.new);
	app.express.get('/admin/delete-post/:id',  auth, admin_posts.remove);
	app.express.post('/admin/add-post/:id?',  auth, admin_posts.add(app));

	
	app.express.get('/admin/', login.index);
	app.express.get('/admin/login_failure', login.index);
	app.express.post('/admin/login', login.authenticate(app));
	
	app.express.get('/post/:id', posts.page(app));
	app.express.get('/', pages.index(app));
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
