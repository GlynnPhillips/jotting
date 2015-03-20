exports.index = function (req, res){
	res.render('admin/login', {dest: req.query.dest});
};

exports.authenticate = function (app) {
	return function (req, res) {
		var attemptedLogin = req.body.username + ':' + req.body.password;
		
		if(app.opts.credentials.indexOf(attemptedLogin) > -1) {
			req.session.access = true;
			req.session.user = req.body.username;
			res.redirect(req.query.dest || '/admin/posts');
		} else {
			res.render('admin/login');
		}
	}
};

