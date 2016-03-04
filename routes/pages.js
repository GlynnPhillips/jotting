'use strict';

const mongoose = require('mongoose');
const posts = mongoose.model('posts');
const request = require('request');
const opts = require('../config');

exports.index = (req, res) => {
	posts.find({published: true}, null, {sort: {publish_date: -1}}, (err, allPosts) => { 
		res.render('home', {posts: allPosts});
	});
};

exports.us = (req, res) => {
	res.render('us');
};

exports.support = (req, res) => {
	res.render('support');
};

exports.donate = (req, res) => {
	const riders = [
		{
			name: 'neil',
			url: opts.neilDonateApi
		},
		{
			name: 'tim',
			url: opts.timDonateApi
		}
	];

	const donations = {};
	let itemsProcessed = 0;
	riders.forEach((rider) => {
		request.get(rider.url, (error, response, body) => {
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

exports.kit = (req, res) => {
	res.render('kit');
};

exports.live = (req, res) => {
	res.render('live');
};
