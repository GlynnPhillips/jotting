var express = require('express');
var app = express();
var hbs = require('hbs');
var bodyParser = require('body-parser');

initApp();

function initApp() {
	var app = express();
	configureApp(app);
	loadRoutes(app);
	startApp(app);
}

function configureApp (app) {
	app.set('view engine', 'hbs');
	app.engine('html', hbs.__express);
	app.use( bodyParser.json() ); // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
		extended: true
	})); 
}

function loadRoutes (app) {
	require('./routes/admin/posts')(app);
	require('./routes/admin/create-post')(app);
	require('./routes/admin/add-post')(app);
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