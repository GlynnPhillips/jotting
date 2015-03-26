var mongoose = require('mongoose');
var posts = mongoose.model('posts');
var marked = require('marked');

exports.page = function (req, res){
	var id = req.params.id;
	posts.byId({_id: id}, function(post) {
		
		if(post.published || req.session.access) {
			var html = marked(post.content);
			post.html = html;
			res.render('post', {post: post});
		} else {
			res.status(404).send('Not found');
		}
	});
};
