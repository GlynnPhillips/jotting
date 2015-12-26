'use strict';

var dust = require('dustjs-linkedin');

dust.helpers.isMultiple = function(chunk, context, bodies, params) {
	params = params || {};
	var position = context.get('$idx') + 1,
	multiple = parseInt(dust.helpers.tap(params.of, chunk, context), 10),
	offset = parseInt(dust.helpers.tap(params.offset, chunk, context) || 0, 10),
	alternate = bodies['else'];

	if (position % multiple === offset) {
		return chunk.render(bodies.block, context);
	}
	if (alternate) {
		return chunk.render(alternate, context);
	}
	return chunk;
};
