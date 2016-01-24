'use strict';

const dust = require('dustjs-linkedin');

dust.helpers.substr = function(chunk, ctx, bodies, params) {
	const str = dust.helpers.tap(params.str, chunk, ctx);
	const begin = dust.helpers.tap(params.begin, chunk, ctx) || 0;
	const end = dust.helpers.tap(params.end, chunk, ctx);
	const len = dust.helpers.tap(params.len, chunk, ctx);

	if (typeof(len) !== 'undefined') {
		return chunk.write(str.substr(begin, len));
	}
	if (typeof(end) !== 'undefined') {
		return chunk.write(str.slice(begin, end));
	}
	return chunk.write(str);
};
