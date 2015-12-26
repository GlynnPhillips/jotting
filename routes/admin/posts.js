var mongoose = require('mongoose');
var posts = mongoose.model('posts');

exports.index = function (req, res){
	posts.list({}, function(allPosts) {
		res.render('admin/posts', {posts: allPosts});
	});
};

exports.new = function (app){
	return function(req, res) {
		var id = req.params.id;

		if(id) {
			posts.byId({_id: id}, function(post) {
				post.image_path = app.opts.image_path;
				res.render('admin/new-post', {post: post});
			});
		} else {
			res.render('admin/new-post');
		}
	}
};

exports.add = function (app) {
	return function(req, res) {
		var postData = {
			id: req.params.id || null,
			published: false,
			user: req.body.user || req.session.user,
			publish_date: req.body.date || '',
			title: req.body.title || '',
			content: req.body.content || '',
			latitude: req.body.lat || '',
			longitude: req.body.long || '',
			strava_id: req.body.strava || '',
			featured_image: req.body.featured || null,
		};
		var images = req.files;
		var autoSave = req.query.as || false;
		var utils = require('./utils.js');
		var uploadImages = utils.uploadImages(app, images);
		
		if(req.body.pub_status === 'on') {
			postData.published = true;
			if(postData.publish_date === '') {
				postData.publish_date = new Date();
			}
		}
		uploadImages.then(function() {
			if(images.length) {
				console.log('Fininished uploading images');
				postData.images = images;
			}
			posts.save(postData, function (newPost) {
				if(postData.published) {
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
	}
};


exports.remove = function (req, res) {
	var id = req.params.id;
	
	posts.removePost({_id: id}, function () {
		res.redirect('/admin/posts');
	});
};

exports.confirmRemoval = function (req, res) {
	var id = req.params.id; 	
	
	if(id) {
		posts.byId({_id: id}, function(post) {
			res.render('admin/confirm-deletion', {post: post});
		});
	} else {
		res.render('admin/');
	}
};
