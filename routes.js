'use strict';

exports.loadRoutes = loadRoutes;

function loadRoutes(app) {

	var admin_posts = require('./routes/admin/posts');
	var login = require('./routes/admin/login');
	var auth = require('./middleware/auth.js');

	var posts = require('./routes/posts');
	var pages = require('./routes/pages');


	app.express.get('/admin/posts', auth, admin_posts.index);
	app.express.get('/admin/new-post/:id?',  auth, admin_posts.new(app));
	app.express.get('/admin/delete-post/:id',  auth, admin_posts.remove);
	app.express.get('/admin/confirm-deletion/:id',  auth, admin_posts.confirmRemoval);
	app.express.post('/admin/add-post/:id?',  auth, admin_posts.add(app));

	
	app.express.get('/admin/', login.index);
	app.express.get('/admin/login_failure', login.index);
	app.express.post('/admin/login', login.authenticate(app));
	
	app.express.get('/post/:id', posts.page(app));
	app.express.get('/', pages.index(app));
}


