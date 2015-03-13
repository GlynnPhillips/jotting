exports.index = function (req, res){
	res.render('admin/login');
};

exports.authenticate = function (app) {
	return function (req, res) {
		var attemptedLogin = req.body.username + ':' + req.body.password;
		
		if(app.opts.credentials.indexOf(attemptedLogin) > -1) {
			req.session.authorized = true;
			res.render('admin/posts');
		} else {
			res.render('admin/login');
		}
	}
};

