'use strict';

var mongoose = require('mongoose');

exports.configureModels = configureModels;

function configureModels () {
	
	var Schema = mongoose.Schema;
	var postSchema = new Schema({
		published: Boolean,
		user: String,
		publish_date: Date,
		title: String,
		content: String,
		latitude: String,
		longitude: String,
		strava_id: String,
		images: [],
		featured_image: String
	});

	postSchema.statics = {
		list: function (query, callback) {
			this.find(query, null, {sort: {publish_date: -1}}, function(err, posts) {
				if (err) {
					return console.error(err);
				}
				callback(posts);
			});
		},
		save: function (postEntry, callback) {
			if(!postEntry.id) {
				var newPost = new this(postEntry);

				newPost.save(function(err, newPost) {
					if (err) {
						return console.error(err);
					}
					callback(newPost);
				});
			} else {
				this.update({_id: postEntry.id}, postEntry, function(err, updatedPost) {
					if (err) {
						return console.error(err);
					}
					callback(updatedPost);
				});
			}
		},

		byId: function (id, callback) {
			this.findOne(id, function (err, post) {
				if (err) {
					return console.error(err);
				}
				callback(post);
			});
		},

		removePost: function (id, callback) {
			this.remove(id, function (err) {
				if (err) {
					return console.error(err);
				}
				callback();
			});
		}

	};

	mongoose.model('posts', postSchema);
}
