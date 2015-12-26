'use strict';

var mongoose = require('mongoose');
var posts = mongoose.model('posts');
var request = require('request');
var async = require('async');

exports.index = function (app) {
	return function (req, res) {
		posts.list({published: true}, function(posts) {
			var stores = {
				fullsize: app.opts.store,
				thumbs: app.opts.thumb_store
			};
			res.render('home', {posts: posts, stores: stores});
		});
	};
};

exports.us = function () {
	return function (req, res) {
		res.render('us');
	};
};

exports.support = function () {
	return function (req, res) {
		res.render('support');
	};
};

exports.donate = function (app) {
	return function (req, res) {
		var riders = [
			{
				name: 'neil',
				url: app.opts.neil_donate_api
			},
			{
				name: 'tim',
				url: app.opts.tim_donate_api
			}
		];

		var donations = {};
			
		async.each(riders, function(rider, callback) {

			request(rider.url, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					var body = JSON.parse(body);
					donations[rider.name] = {
						total: body.pageDetails[0].donationTotalNet,
						target: body.pageDetails[0].targetAmount,
						url: body.personalUrl
					};
					callback();
				 }

			});
		}, function(err){
			if( err ) {
				res.render('donate');
			} else {
				res.render('donate', {donations: donations});
			}
		});	
			
	};
};

exports.kit = function () {
	return function (req, res) {
		res.render('kit');
	};
};

exports.live = function () {
	return function (req, res) {
		res.render('live');
	};
};
