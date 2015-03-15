'use strict'

module.exports = function (req, res, next) {
	console.log(req.session);
	if(!req.session.access) {
		return res.redirect('/admin');
	}
}
