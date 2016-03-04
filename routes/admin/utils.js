'use strict';

const cloudinary = require('cloudinary');
const TwitterAPI = require('node-twitter-api');
const opts = require('../../config');

exports.formatData = (data) => {
	return new Promise((resolve) => {
		// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
		const formated = {
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

		if (data.body.pub_status === 'on') {
			formated.published = true;
			if (!formated.publish_date) {
				formated.publish_date = new Date();
			}
		}
		// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
		if (data.files.length) {
			formated.images = data.files;
		}

		resolve(formated);
	});
};
exports.uploadImages = (images) => {
	return new Promise((resolve, reject) => {
		let filesUploaded = 0;

		if (!images.length) {
			resolve();
		}
		// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
		cloudinary.config({
			cloud_name: opts.storeName,
			api_key: opts.storeKey,
			api_secret: opts.storeSecret
		});

		images.forEach((image) => {
			cloudinary.uploader.upload(image.path, (result) => {
				images[images.indexOf(image)].cloudinary = {
					id: result.public_id,
					format: result.format
				};

				if (result.error) {
					reject(result.error);
				}

				filesUploaded++;
				if (filesUploaded === images.length) {
					resolve();
				}
			});
		});
		// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
	});
};
exports.sendTweet = (data) => {
	return new Promise((resolve, reject) => {
		
		if (data.published && opts.env === 'production') {
			const tweet = 'Update on my progress in the #TCR2015 - ' + data.title + ' http://cobbles-to-kebabs.co.uk/post/';
			const twitter = new TwitterAPI({
				consumerKey: opts.twitterKey,
				consumerSecret: opts.twitterSecret,
				callback: 'http://cobbles-to-kebabs.co.uk'
			});

			twitter.statuses('update', {
					status: tweet + data._id
				},
				opts.twitterAccess,
				opts.twitterAccessSecret,
				(error) => {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
				}
			);
		} else {
			resolve();
		}
	});
};
