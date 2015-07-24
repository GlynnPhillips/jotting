var which_country = require('which-country');
var mongoose = require('mongoose');
var posts = mongoose.model('posts');
var marked = require('marked');
var im = require('imagemagick');
var async = require('async');
var twitterAPI = require('node-twitter-api');
var cloudinary = require('cloudinary');

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

exports.add = function (app){
	return function(req, res) {
		var id = req.params.id,
			pubStatus = false,
			postUser = req.body.user || req.session.user,
			postTitle = req.body.title || '',
			postContent = req.body.content || '',
			postLat = req.body.lat || '',
			postLong = req.body.long || '',
			postDate = req.body.date || '',
			postCountry = which_country([postLong, postLat]) || '',
			stravaId = req.body.strava || '',
			uploadedImages = req.files.image,
			featuredImage = req.body.featured || null,
			autoSave = req.query.as || false;

		
		if(req.body.pub_status === 'on') {
			pubStatus = true;

			if(postDate === '') {
				postDate = new Date();
			}
		}
		
		if(typeof uploadedImages !== 'undefined') {
			uploadedImages = [].concat(req.files.image);
			cloudinary.config({ 
				cloud_name: 'dzhgr7vgx', 
				api_key: '651425911969212', 
				api_secret: 'NQ7BN-01L7NkCTQi0xmW2Rw0zqI' 
			});
			

			
			async.each(uploadedImages, function(file, callback) {

				cloudinary.uploader.upload(file.path, function(result) { 
					uploadedImages[uploadedImages.indexOf(file)].cloudinary = {
						id: result.public_id,
						format: result.format
					};
					callback();
				});
			}, function(err){
				if( err ) {
				  console.log('A file failed to process');
				} else {
				  console.log('All files have been processed successfully');
					createRecord(uploadedImages);	
				}
			});
		} else {
			createRecord(uploadedImages);	
		}

	
		

		function createRecord (postImages) {
			var postEntry = {
				published: pubStatus,
				user: postUser,
				publish_date: postDate,
				title: postTitle,
				content: postContent,
				latitude: postLat,
				longitude: postLong,
				strava_id: stravaId,
				country: postCountry,
				featured_image: featuredImage 
			};
			
			console.log(postImages)
			var tweet = "Update on my progress in the #TCR2015 - " + postTitle + " http://cobbles-to-kebabs.co.uk/post/";
			
			
			if(!id) {
				
				postEntry.images = postImages;

				if(autoSave) {
					posts.addPost(postEntry, function (newPost, err) {
						res.send({id: newPost._id, type: 'save'});
					});
				} else {
					posts.addPost(postEntry, function (newPost) {
						if(postEntry.published) {
							
							var twitter = new twitterAPI({
								consumerKey: app.opts.twitter_key,
								consumerSecret: app.opts.twitter_secret,
								callback: 'http://cobbles-to-kebabs.co.uk'
							});

							twitter.statuses("update", {
									status: tweet + newPost._id
								},
								app.opts.twitter_access,
								app.opts.twitter_access_secret,
								function(error, data, response) {
									if (error) {
										console.log(error);
									}
								}
							);
							
						}
						
						res.redirect('/admin/posts');
					});
				}
			} else {
		
				if(typeof uploadedImages !== 'undefined' && postImages.length > 0) {
					postEntry.images = postImages;
				}
				
				if(autoSave) {
					posts.updatePost({_id: id}, postEntry, function (updatedPost, err) {
						res.status(200).send({id: updatedPost._id, type: 'update'});
					});
				} else {
					posts.updatePost({_id: id}, postEntry, function () {
						if(postEntry.published) {
							
							var twitter = new twitterAPI({
								consumerKey: app.opts.twitter_key,
								consumerSecret: app.opts.twitter_secret,
								callback: 'http://cobbles-to-kebabs.co.uk'
							});

							twitter.statuses("update", {
									status: tweet + id
								},
								app.opts.twitter_access,
								app.opts.twitter_access_secret,
								function(error, data, response) {
									if (error) {
										console.log(error);
									}
								}
							);
							
						}
						res.redirect('/admin/posts');
					});

				}
			}
		}
	}
};

exports.remove = function (req, res){
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
