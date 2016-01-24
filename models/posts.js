'use strict';

const mongoose = require('mongoose');

exports.configureModels = () => {

	// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
	const Schema = mongoose.Schema;
	const postSchema = new Schema({
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
	// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

	postSchema.statics = {
		list: function(query, callback) {
			// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
			this.find(query, null, {sort: {publish_date: -1}}, function(err, posts) {
				if (err) {
					return console.error(err);
				}
				callback(posts);
			});
			// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
		},
		save: function(postEntry, callback) {
			if (!postEntry.id) {
				const newPost = new this(postEntry);

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

		byId: function(id, callback) {
			this.findOne(id, function(err, post) {
				if (err) {
					console.error(err);
					callback(err);
				} else {
					callback(null, post);
				}
			});
		},

		removePost: function(id, callback) {
			this.remove(id, function(err) {
				if (err) {
					return console.error(err);
				}
				callback();
			});
		}

	};

	mongoose.model('posts', postSchema);
}
