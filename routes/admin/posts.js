'use strict';

var mongoose = require('mongoose');
var posts = mongoose.model('posts');

exports.index = function(req, res) {
	posts.list({}, function(allPosts) {
		res.render('admin/posts', {posts: allPosts});
	});
};

exports.new = function(app) {
	return function(req, res) {
		var id = req.params.id;

		if (id) {
			posts.byId({_id: id}, function(error, post) {
				if (!error) {
					post.imagePath = app.opts.imagePath;
					res.render('admin/new-post', {post: post});
				} else {
					res.status(404).send('Article not found');
				}
			});
		} else {
			res.render('admin/new-post');
		}
	};
};

exports.add = function(app) {
	return function(req, res) {

		var utils = require('./utils.js');
		var formatData = utils.formatData(req);
		var uploadImages = utils.uploadImages(app, req.files);

		formatData.then(function(postData) {
			uploadImages.then(function() {
				console.log('Fininished uploading images');
				posts.save(postData, function() {
					if (postData.published) {
						utils.sendTweet(app, postData).then(function() {
							console.log('Tweet posted');
						}).catch(function(error) {
							console.log('Failure: Tweet not sent');
							console.log(error);
						});
					}
					res.redirect('/admin/posts');
				});
			}).catch(function(error) {
				console.log('A file failed to process');
				console.log(error);
			});
		});
	};
};


exports.remove = function(req, res) {
	var id = req.params.id;

	posts.removePost({_id: id}, function() {
		res.redirect('/admin/posts');
	});
};

exports.confirmRemoval = function(req, res) {
	var id = req.params.id;

	if (id) {
		posts.byId({_id: id}, function(error, post) {
			if (!error) {
				res.render('admin/confirm-deletion', {post: post});
			} else {
				res.status(404).send('Article not found');
			}
		});
	} else {
		res.render('admin/');
	}
};
