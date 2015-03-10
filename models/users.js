var mongoose = require('mongoose'),
	connection_url = 'mongodb://localhost:27017';


var schema = mongoose.Schema;

var userSchema = new schema({
		username: String,
		password: String,
		first_name: String,
		last_name: String
	});

userSchema.statics.getUser = function (user, callback) {
	this.find({}, function(err, posts) {
		console.log(posts)
		callback(err, posts)
	});
}

mongoose.model('users', userSchema);
