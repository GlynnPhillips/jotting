module.exports = function(app) {
	var mongoose = require('mongoose');
	var connection_url = app.opts.db;

	mongoose.connect(connection_url);
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
		images: []
	});

	postSchema.statics = {
		listPosts: function (callback) {
			this.find({}, function(err, posts) {
				callback(err, posts)
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
