'use strict';

module.exports = defineRoute;

function defineRoute (app) {
	app.get('/admin/posts', function(req, res) {

		var getPosts = require('../../models/get-posts')('posts', function(posts) {
			
			res.render('admin/posts',{title:"My Blog", posts: posts});
		});
		
	});
}