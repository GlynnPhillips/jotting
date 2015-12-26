'use strict';

module.exports = function (req, res, next) {
	if(!req.session.access) {
		return res.redirect('/admin?dest=' + req.path);
	}

	next();
};
