'use strict';

exports.loadRoutes = (app) => {

	const adminPosts = require('./routes/admin/posts');
	const login = require('./routes/admin/login');
	const auth = require('./middleware/auth.js');
	const posts = require('./routes/posts');
	const pages = require('./routes/pages');
	const {express} = app;

	express.get('/admin/posts', auth, adminPosts.index);
	express.get('/admin/new-post/:id?', auth, adminPosts.new(app));
	express.get('/admin/delete-post/:id', auth, adminPosts.remove);
	express.get('/admin/confirm-deletion/:id', auth, adminPosts.confirmRemoval);
	express.post('/admin/add-post/:id?', auth, adminPosts.add(app));

	express.get('/admin/', login.index);
	express.get('/admin/login_failure', login.index);
	express.post('/admin/login', login.authenticate(app));

	express.get('/post/:id', posts.index(app));
	express.get('/', pages.index(app));

	express.get('/us', pages.us(app));
	express.get('/support', pages.support(app));
	express.get('/donate', pages.donate(app));
	express.get('/kit', pages.kit(app));
	express.get('/live', pages.live(app));
}


