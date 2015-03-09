var mongoose = require('mongoose');
var which_country = require('which-country');
var posts = mongoose.model('posts');

exports.index = function (req, res){
	
	posts.listPosts(function(err, allPosts) {
		res.render('admin/posts', {posts: allPosts});
	});
};

exports.new = function (req, res){
	var id = req.params.id;

	if(id) {
		posts.byId({_id: id}, function(post) {
			console.log(post)
			res.render('admin/new-post', {post: post});
		});
	} else {
		res.render('admin/new-post');
	}
};

exports.add = function (req, res){
	var id = req.params.id,
		pubStatus = false,
		postTitle = req.body.title || '',
		postContent = req.body.content || '',
		postLat = req.body.lat || '',
		postLong = req.body.long || '',
		postDate = new Date(),
		postCountry = which_country([postLong, postLat]) || '',
		uploadedImages = req.files.image,
		postImages = [];


	if(uploadedImages) {
		for(var i = 0; i < uploadedImages.length; i++) {
			postImages.push({name:uploadedImages[i].name});
		}
	}

	if(req.body.pub_status === 'on') {
		pubStatus = true;
	}


	var postEntry = {
		published: pubStatus,
		publish_date: postDate,
		title: postTitle,
		content: postContent,
		latitude: postLat,
		longitude: postLong,
		country: postCountry,
		images: postImages
	}

	if(!id) {
		posts.addPost(postEntry, function () {
			res.redirect('/admin/posts');
		});
	} else {
		posts.updatePost({_id: id}, postEntry, function () {
			res.redirect('/admin/posts');
		});
	}
};

exports.remove = function (req, res){
	var id = req.params.id;
	
	posts.removePost({_id: id}, function () {
		res.redirect('/admin/posts');
	});
};