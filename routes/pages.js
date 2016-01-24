'use strict';

const mongoose = require('mongoose');
const posts = mongoose.model('posts');
const request = require('request');
const async = require('async');

exports.index = () => {
	return function(req, res) {
		posts.list({published: true}, function(posts) {
			res.render('home', {posts: posts});
		});
	};
};

exports.us = () => {
	return function(req, res) {
		res.render('us');
	};
};

exports.support = function() {
	return function(req, res) {
		res.render('support');
	};
};

exports.donate = (app) => {
	return function(req, res) {
		const riders = [
			{
				name: 'neil',
				url: app.opts.neilDonateApi
			},
			{
				name: 'tim',
				url: app.opts.timDonateApi
			}
		];

		const donations = {};

		async.each(riders, function(rider, callback) {

			request(rider.url, function(error, response, body) {
				if (!error && response.statusCode === 200) {

					const data = JSON.parse(body);
					donations[rider.name] = {
						total: data.pageDetails[0].donationTotalNet,
						target: data.pageDetails[0].targetAmount,
						url: data.personalUrl
					};
					callback();
				}

			});
		}, function(err) {
			if (err) {
				res.render('donate');
			} else {
				res.render('donate', {donations: donations});
			}
		});

	};
};

exports.kit = () => {
	return function(req, res) {
		res.render('kit');
	};
};

exports.live = () => {
	return function(req, res) {
		res.render('live');
	};
};
