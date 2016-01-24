'use strict';

const mongoose = require('mongoose');
const posts = mongoose.model('posts');
const marked = require('marked');
const strava = require('strava-v3');

exports.index = function(app) {
	return function(req, res) {
		const id = req.params.id;
		posts.byId({_id: id}, function(error, post) {
			if (post && post.published || (post && req.session.access)) {
				post.html = marked(post.content);
				post.imagePath = app.opts.imagePath;
				// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
				if (post.strava_id) {
					strava.activities.get({id: post.strava_id}, function(err, payload) {
						if (!err) {
							const activity = {};

							activity.elevation = payload.total_elevation_gain.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

							activity.distance = payload.distance / 1000;
							activity.distance = Math.round(activity.distance * 10) / 10;
							activity.name = payload.name;
							activity.id = payload.id;

							post.strava_activity = activity;
							res.render('post', {post: post});
						} else {

							res.render('post', {post: post});
						}

					});
				} else {
					res.render('post', {post: post});
				}
				// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

			} else {
				res.sendStatus(404);
			}
		});
	};
};
