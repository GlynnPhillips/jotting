var mongoose = require('mongoose');
var connection_url = 'mongodb://localhost:27017';

mongoose.createConnection(connection_url);
var schema = mongoose.Schema;

var postSchema = new schema({
	published: Boolean,
	publish_date: Date,
	title: String,
	content: String,
	latitude: String,
	longitude: String,
	country: String,
	images: Array
});

postSchema.statics = {
	listPosts: function (callback) {
		this.find({}, function(err, posts) {
			callback(err, posts)
		});
	}
}

postSchema.statics.addPost = function (postEntry, callback) {
	var newPost = new this(postEntry);

	newPost.save(function(err, newPost) {
		if (err) return console.error(err);
		callback();
	});
}

postSchema.statics.updatePost = function (conditions, postEntry, callback) {
	this.update(conditions, postEntry, function(err, newPost) {
		if (err) return console.error(err);
		callback();
	});
}

postSchema.statics.byId = function (id, callback) {
	this.findOne(id, function (err, post){
		callback(post);
	});
}

postSchema.statics.removePost = function (id, callback) {
	this.remove(id, function (err, post){
		callback();
	});
}

mongoose.model('posts', postSchema);