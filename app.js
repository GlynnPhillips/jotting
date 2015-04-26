var mongoose = require('mongoose');
var fs = require('fs');
var easyimg = require('easyimage');


var startApplication = require('./app/start.js');

var opts = {
	credentials: process.env.CREDENTIALS,
	db: process.env.MONGO_URL,
	secret: process.env.SECRET,
	store: process.env.CLOUD_DIR || __dirname + '/uploads',
};

opts.thumb_store = opts.store + '/thumbs';


startApplication(opts, function (err, app) {


initApp(opts);

function initApp() {
	loadModels(app);
	loadRoutes(app);
	startApp(app);

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



});





