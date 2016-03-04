'use strict';

const mongoose = require('mongoose');
const posts = mongoose.model('posts');
const opts = require('../../config');

exports.index = (req, res) => {
	posts.find({}, null, {sort: {publish_date: -1}}, (err, allPosts) => {
		res.render('admin/posts', {posts: allPosts});
	});
};

exports.new = (req, res) => {
	const id = req.params.id;

	if (id) {
		posts.findOne({_id: id}, (error, post) => {
			if (!error) {
				post.imagePath = opts.imagePath;
				res.render('admin/new-post', {post: post});
			} else {
				res.status(404).send('Article not found');
			}
		});
	} else {
		res.render('admin/new-post');
	}
};

exports.add = (req, res) => {
	const utils = require('./utils.js');
	const formatData = utils.formatData(req);
	const uploadImages = utils.uploadImages(req.files);

	formatData.then((postData) => {
		uploadImages.then(() => {
			console.log('Fininished uploading images');
			if(!postData.id) {
				const Posts = new posts(postData);
				Posts.save(postData, () => {
					if (postData.published && opts.env === 'production') {
						utils.sendTweet(postData).then(() => {
							console.log('Tweet posted');
						}).catch((error) => {
							console.log('Failure: Tweet not sent');
							console.log(error);
						});
					}
					res.redirect('/admin/posts');
				});
			} else {
				posts.update({_id: postData.id}, postData, () => {
					if (postData.published && opts.env === 'production') {
						utils.sendTweet(postData).then(() => {
							console.log('Tweet posted');
						}).catch((error) => {
							console.log('Failure: Tweet not sent');
							console.log(error);
						});
					}
					res.redirect('/admin/posts');
				});
			}
		}).catch((error) => {
			console.log('A file failed to process');
			console.log(error);
		});
	});
};


exports.remove = (req, res) => {
	const id = req.params.id;

	posts.remove({_id: id}, () => {
		res.redirect('/admin/posts');
	});
};

exports.confirmRemoval = (req, res) => {
	const id = req.params.id;

	if (id) {
		posts.findOne({_id: id}, (error, post) => {
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
