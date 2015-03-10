var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');


initApp();

function initApp() {
	var app = express();
	loadModels(app);
	configureApp(app);
	loadRoutes(app);
	startApp(app);
}

function configureApp (app) {
	app.set('view engine', 'hbs');
	app.engine('html', hbs.__express);
	app.use( bodyParser.json() );
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(multer({
        dest: './uploads/',
        rename: function (fieldname, filename) {
			return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
		}
	}));

	app.use('/resources', express.static(__dirname+'/resources'));
	app.use('/uploads', express.static(__dirname+'/uploads'));

	app.use(passport.initialize());
	app.use(passport.session());


	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});

	var users = mongoose.model('users');

	passport.use(new LocalStrategy(
		function(username, password, done) {
			process.nextTick(function () {
				users.getUser({username: username},
				function(err, user) {
					if (err) {
						return done(err);
      				}
 
					if (!user) {
						return done(null, false);
					}

					if (user.password != password) {
						return done(null, false);
					}

					return done(null, user);
				});
			});
		}
	));
}

function loadModels () {
	require('./models/posts');
	require('./models/users');
}

function loadRoutes (app) {
	var posts = require('./routes/admin/posts');
	var login = require('./routes/admin/login');

	app.get('/admin/posts', posts.index);
	app.get('/admin/new-post/:id?', posts.new);
	app.get('/admin/delete-post/:id', posts.remove);
	app.post('/admin/add-post/:id?', posts.add);

	
	app.get('/admin/', login.index);
	app.get('/admin/login_failure', login.index);
	app.post('/admin/authenticate', passport.authenticate('local', {
			successRedirect: '/admin/posts',
			failureRedirect: '/admin/login_failure/'
		})
	);
	

	/*
	require('./routes/admin/login')(app);
	require('./routes/admin/auth')(app);
	require('./routes/admin/create-post')(app);
	require('./routes/admin/add-post')(app);
	
	*/
}

function startApp (app) {
	var ip = 'localhost';
	var port = 3000
	app.listen(port, ip, function (err) {
		if(err) {
			console.error('App failed to start');
			console.error(err.stack);
			process.exit(1);
		}
		console.log( "App started on " + ip + ", port " + port );
	});
}