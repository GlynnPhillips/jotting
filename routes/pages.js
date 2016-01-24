'use strict';

const mongoose = require('mongoose');
const posts = mongoose.model('posts');
const request = require('request');

exports.index = () => {
	return (req, res) => {
		posts.list({published: true}, function(posts) {
			res.render('home', {posts: posts});
		});
	};
};

exports.us = () => {
	return (req, res) => {
		res.render('us');
	};
};

exports.support = () => {
	return (req, res) => {
		res.render('support');
	};
};

exports.donate = (app) => {
	return (req, res) => {
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
		let itemsProcessed = 0;
		riders.forEach((rider) => {
			request(rider.url, (error, response, body) => {
				if (!error && response.statusCode === 200) {

					const data = JSON.parse(body);
					donations[rider.name] = {
						total: data.pageDetails[0].donationTotalNet,
						target: data.pageDetails[0].targetAmount,
						url: data.personalUrl
					};

				}
				itemsProcessed++;
				if (itemsProcessed === riders.length) {
					res.render('donate', {donations: donations});
				}

			});


		});

	};
};

exports.kit = () => {
	return (req, res) => {
		res.render('kit');
	};
};

exports.live = () => {
	return (req, res) => {
		res.render('live');
	};
};
