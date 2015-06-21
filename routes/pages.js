var mongoose = require('mongoose');
var posts = mongoose.model('posts');
var request = require('request');
var async = require('async');

exports.index = function (app) {
	return function (req, res) {
		posts.list({published: true}, function(posts) {
			stores = {
				fullsize: app.opts.store,
				thumbs: app.opts.thumb_store
			}
			res.render('home', {posts: posts, stores: stores});
		});
	}
};

exports.us = function (app) {
	return function (req, res) {
		res.render('us');
	}
};

exports.support = function (app) {
	return function (req, res) {
		res.render('support');
	}
};

exports.donate = function (app) {
	return function (req, res) {
		var riders = [
			{
				name: 'neil',
				url: app.opts.neil_donate_api
			}
		];
		request(app.opts.neil_donate_api, function (error, response, body) {
			var donations = {};
			if (!error && response.statusCode == 200) {
				var body = JSON.parse(body);
				donations['neil'] = {
					total: body.pageDetails[0].donationTotalGA,
					target: body.pageDetails[0].targetAmount,
					url: body.personalUrl
				}
				res.render('donate', {donations: donations});
			 } else {
				res.render('donate');
			 }
		});			
			
	}
};
