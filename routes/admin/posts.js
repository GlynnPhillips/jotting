'use strict';

const mongoose = require('mongoose');
const posts = mongoose.model('posts');

exports.index = (req, res) => {
	posts.list({}, function(allPosts) {
		res.render('admin/posts', {posts: allPosts});
	});
};

exports.new = (app) => {
	return function(req, res) {
		const id = req.params.id;

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

exports.add = (app) => {
	return function(req, res) {

		const utils = require('./utils.js');
		const formatData = utils.formatData(req);
		const uploadImages = utils.uploadImages(app, req.files);

		formatData.then(function(postData) {
			uploadImages.then(function() {
				console.log('Fininished uploading images');
				posts.save(postData, function() {
					if (postData.published && app.opts.env === 'production') {
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


exports.remove = (req, res) => {
	const id = req.params.id;

	posts.removePost({_id: id}, function() {
		res.redirect('/admin/posts');
	});
};

exports.confirmRemoval = (req, res) => {
	const id = req.params.id;

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
