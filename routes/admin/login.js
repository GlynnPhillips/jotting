'use strict';

exports.index = (req, res) => {
	res.render('admin/login', {dest: req.query.dest});
};

exports.authenticate = (app) => {
	return (req, res) => {
		const attemptedLogin = req.body.username + ':' + req.body.password;
		const users = app.opts.credentials.split(';');

		for (var i = 0; i < users.length; i++) {

			if (attemptedLogin === users[i]) {
				i = users.length;
				req.session.access = true;
				req.session.user = req.body.username;
				res.redirect(req.query.dest || '/admin/posts');
			} else if (i === users.length - 1) {
				res.render('admin/login');
			}

		}
	};
};

