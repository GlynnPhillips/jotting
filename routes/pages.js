var mongoose = require('mongoose');
var posts = mongoose.model('posts');

exports.index = function (app) {
	return function (req, res) {
		posts.list({published: true}, function(posts) {
			res.render('home', {posts: posts});
		});
	}
};
