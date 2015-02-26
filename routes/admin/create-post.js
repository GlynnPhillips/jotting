'use strict';

module.exports = defineRoute;

function defineRoute (app) {
	app.get('/admin/create', function(req, res) {
		res.render('admin/create',{title:"My Blog", content: "hello world!"});
	});
}