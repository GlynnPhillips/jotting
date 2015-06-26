exports.index = function (req, res){
	res.render('admin/login', {dest: req.query.dest});
};

exports.authenticate = function (app) {
	return function (req, res) {
		var attemptedLogin = req.body.username + ':' + req.body.password;
		var users = app.opts.credentials.split(';');

		for(var i = 0; i < users.length; i++) {
			
			if(attemptedLogin === users[i]) {
				i = users.length;
				req.session.access = true;
				req.session.user = req.body.username;
				res.redirect(req.query.dest || '/admin/posts');
			} else if(i === users.length - 1) {
				res.render('admin/login');
			}

		}
	}
};

