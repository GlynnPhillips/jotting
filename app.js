var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');


initApp();

function initApp() {
	var app = express();
	configureApp(app);
	loadModels(app);
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

	app.use('/resources', express.static(__dirname+'/resources'));
}

function loadModels () {
	require('./models/posts');
}

function loadRoutes (app) {
	var posts = require('./routes/admin/posts');
	app.get('/admin/posts', posts.index);
	app.get('/admin/new-post/:id?', posts.new);
	app.post('/admin/add-post/:id?', posts.add);
	app.get('/admin/delete-post/:id', posts.remove);


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