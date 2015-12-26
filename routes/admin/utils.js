'use strict';

/* jshint esnext: true */

var async = require('async');
var cloudinary = require('cloudinary');
var twitterAPI = require('node-twitter-api');

exports.formatData = function(data) {
	return new Promise(function(resolve) {
		var formated = {
			id: data.params.id,
			published: false,
			user: data.body.user || data.session.user,
			publish_date: data.body.date,
			title: data.body.title,
			content: data.body.content,
			latitude: data.body.lat,
			longitude: data.body.long,
			strava_id: data.body.strava,
			featured_image: data.body.featured
		};
		
		if(data.body.pub_status === 'on') {
			formated.published = true;
			if(!formated.publish_date) {
				formated.publish_date = new Date();
			}
		}
		if(data.files.length) {
			formated.images = data.files;
		}

		resolve(formated);
	});			
};
exports.uploadImages = function(app, images) {
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
};
exports.sendTweet = function(app, data) {
	return new Promise(function(resolve, reject) {
		var tweet = 'Update on my progress in the #TCR2015 - ' + data.title + ' http://cobbles-to-kebabs.co.uk/post/';
		var twitter = new twitterAPI({
			consumerKey: app.opts.twitter_key,
			consumerSecret: app.opts.twitter_secret,
			callback: 'http://cobbles-to-kebabs.co.uk'
		});

		twitter.statuses('update', {
				status: tweet + data._id
			},
			app.opts.twitter_access,
			app.opts.twitter_access_secret,
			function(error) {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}
		);
	});
};
