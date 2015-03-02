var mongoose = require('mongoose');
var connection_url = 'mongodb://localhost:27017';

mongoose.createConnection(connection_url);

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
			res.render('admin/new-post', {post: post});
		});
	} else {
		res.render('admin/new-post');
	}

};

exports.add = function (req, res){
	var id = req.params.id;
	var postTitle = req.body.title;
	var postContent = req.body.content;
	var postLat = req.body.lat;
	var postLong = req.body.long;
	var postDate = new Date();

	var postEntry = {
		publish_date: postDate,
		title: postTitle,
		content: postContent,
		latitude: postLat,
		longitude: postLong
	};

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