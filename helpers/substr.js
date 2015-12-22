var dust = require('dustjs-linkedin');

dust.helpers.substr = function (chunk, ctx, bodies, params) {
	var str = dust.helpers.tap(params.str, chunk, ctx),
		begin = dust.helpers.tap(params.begin, chunk, ctx),
		end = dust.helpers.tap(params.end, chunk, ctx),
		len = dust.helpers.tap(params.len, chunk, ctx);
		begin = begin || 0;

	if (!(typeof(len) === 'undefined')) {
		return chunk.write(str.substr(begin,len));
	}
	if (!(typeof(end) === 'undefined')) {
		return chunk.write(str.slice(begin,end));
	}
	return chunk.write(str);
}
