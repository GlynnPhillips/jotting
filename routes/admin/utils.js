var async = require('async');
var cloudinary = require('cloudinary');
var twitterAPI = require('node-twitter-api');

module.exports = {
	uploadImages: function(app, images) {
		return new Promise( function (resolve, reject) {
			if (!images.length) {
				resolve();
			}
			cloudinary.config({ 
				cloud_name: app.opts.store_name, 
				api_key: app.opts.store_key, 
				api_secret: app.opts.store_secret
			});
			
			async.each(images, function(file, callback) {
				cloudinary.uploader.upload(file.path, function(result) { 
					images[images.indexOf(file)].cloudinary = {
						id: result.public_id,
						format: result.format
					};
					callback();
				});
			}, function(err){
				if( err ) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	},
	sendTweet: function(app, data) {
		return new Promise(function(resolve, reject) {
			var tweet = "Update on my progress in the #TCR2015 - " + data.title + " http://cobbles-to-kebabs.co.uk/post/";
			var twitter = new twitterAPI({
				consumerKey: app.opts.twitter_key,
				consumerSecret: app.opts.twitter_secret,
				callback: 'http://cobbles-to-kebabs.co.uk'
			});

			twitter.statuses("update", {
					status: tweet + data._id
				},
				app.opts.twitter_access,
				app.opts.twitter_access_secret,
				function(error, data, response) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				}
			);
		});
	}
}
