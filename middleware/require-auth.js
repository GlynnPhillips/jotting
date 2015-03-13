'use strict'

module.exports = function (req, res, next) {
	if(!req.session.authorized) {
		return res.redirect('admin/login');
	}

	next();
}
