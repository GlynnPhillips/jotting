var mongoose = require('mongoose');
var posts = mongoose.model('posts');
var marked = require('marked');
var strava = require('strava-v3');

exports.page = function (app) {
	return function (req, res) {
		var id = req.params.id;
		posts.byId({_id: id}, function(post) {
			
			if(post.published || req.session.access) {
				var html = marked(post.content);
				post.html = html;
				post.stores = {
					fullsize: app.opts.store,
					thumbs: app.opts.thumb_store
				}

				if(post.strava_id) {
					strava.activities.get({id:post.strava_id},function(err,payload) {
						post.strava_activity = payload;
						res.render('post', {post: post});
					});
				} else {

					res.render('post', {post: post});
				}

			} else {
				res.status(404).send('Not found');
			}
		});
	}
};
