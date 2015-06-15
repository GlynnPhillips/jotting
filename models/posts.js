'use strict'

var mongoose = require('mongoose');

exports.configureModels = configureModels;

function configureModels (app) {
	
	var schema = mongoose.Schema;
	var postSchema = new schema({
		published: Boolean,
		user: String,
		publish_date: Date,
		title: String,
		content: String,
		latitude: String,
		longitude: String,
		country: String,
		strava_id: String,
		images: [],
		featured_image: String
	});

	postSchema.statics = {
		list: function (query, callback) {
			this.find(query, function(err, posts) {
				callback(posts)
			});
		},
		addPost: function (postEntry, callback) {
			var newPost = new this(postEntry);

			newPost.save(function(err, newPost) {
				if (err) return console.error(err);
				callback();
			});
		},

		updatePost: function (conditions, postEntry, callback) {
			this.update(conditions, postEntry, function(err, newPost) {
				if (err) return console.error(err);
				callback();
			});
		},

		byId: function (id, callback) {
			this.findOne(id, function (err, post){
				callback(post);
			});
		},

		removePost: function (id, callback) {
			this.remove(id, function (err, post){
				callback();
			});
		}

	}

	mongoose.model('posts', postSchema);
}
