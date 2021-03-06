'use strict';

const dateformat = require('dateformat');
const dust = require('dustjs-linkedin');

dust.helpers.dateFormat = function(chunk, context, bodies, params) {
	let date = null;
	let value = null;

	params = params || {};

	try {
		value = (params.date) ? dust.helpers.tap(params.date, chunk, context) : null;
		date = (value) ? new Date(value.match(/^[0-9]+$/) ? parseInt(value, 10) : value) : new Date();
		chunk.write(dateformat(date, params.format || 'yyyy-mm-dd'));
	} catch (e) {
		console.error(e.message);
	}
	return chunk;
};

