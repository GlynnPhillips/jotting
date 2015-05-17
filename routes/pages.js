var mongoose = require('mongoose');
var posts = mongoose.model('posts');

exports.index = function (app) {
	return function (req, res) {
		posts.list({published: true}, function(posts) {
			stores = {
				fullsize: app.opts.store,
				thumbs: app.opts.thumb_store
			}
			res.render('home', {posts: posts, stores: stores});
		});
	}
};
