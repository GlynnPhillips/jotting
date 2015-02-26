'use strict';

module.exports = defineRoute;

function defineRoute (app) {

	app.post('/admin/add-post', function (req, res) {

		var postTitle = req.body.title;
		var postContent = req.body.content;
		var postDate = new Date();

		var postEntry = {publish_date: postDate, title: postTitle, content: postContent}

		var addPost = require('../../models/add-post')('posts', postEntry, function(posts) {
			res.redirect( '/admin/posts' );
		});
	});
}