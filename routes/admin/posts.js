var mongoose = require('mongoose');
var which_country = require('which-country');
var posts = mongoose.model('posts');
var marked = require('marked');
var im = require('imagemagick');
var async = require('async');

exports.index = function (req, res){
	
	posts.list({}, function(allPosts) {
		res.render('admin/posts', {posts: allPosts});
	});
};

exports.new = function (req, res){
	var id = req.params.id;

	if(id) {
		posts.byId({_id: id}, function(post) {
			res.render('admin/new-post', {post: post});
		});
	} else {
		res.render('admin/new-post');
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
			postDate = new Date(),
			postCountry = which_country([postLong, postLat]) || '',
			stravaId = req.body.strava || '',
			uploadedImages = req.files.image;

		if(typeof uploadedImages !== 'undefined') {
			uploadedImages = [].concat(req.files.image);
		}

		if(req.body.pub_status === 'on') {
			pubStatus = true;
		}
		
		function getExifData (images, callback) {
			var postImages = [];
			async.each(images, function(image, callback) {
				im.readMetadata(app.opts.store + '/' + image.name, function(error, metadata) {
				if(error) {
					throw error;
				}
				if(metadata.exif) {
						image.latitude = metadata.exif.gpsLatitude || '';
						image.longitude = metadata.exif.gpsLongitude || '';
					} else {
						image.latitude = '';
						image.longitude = '';
					}
					postImages.push(image);
					callback();
				});
			}, function(error) {
				if(error) {
					throw error;
				}
				createRecord(postImages);
			});
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
				country: postCountry
			}

			if(!id) {
				postEntry.images = postImages;
				posts.addPost(postEntry, function () {
					res.redirect('/admin/posts');
				});
			} else {
		
				if(typeof uploadedImages !== 'undefined' && postImages.length > 0) {
					postEntry.images = postImages;
				}
				posts.updatePost({_id: id}, postEntry, function () {
					res.redirect('/admin/posts');
				});
			}
		}
		if(typeof uploadedImages !== 'undefined' && uploadedImages.length > 0) {
			getExifData(uploadedImages);
		} else {
			createRecord([]);	
		}
	}
};

exports.remove = function (req, res){
	var id = req.params.id;
	
	posts.removePost({_id: id}, function () {
		res.redirect('/admin/posts');
	});
};
