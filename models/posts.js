'use strict';

const mongoose = require('mongoose');
// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const Schema = mongoose.Schema;
const postSchema = new Schema({
	published: Boolean,
	user: String,
	publish_date: Date,
	title: String,
	content: String,
	latitude: String,
	longitude: String,
	strava_id: String,
	images: [],
	featured_image: String
});
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

exports.configureModels = mongoose.model('posts', postSchema);
