'use strict';

const opts = require('./config.js');
const startApplication = require('./start.js');

startApplication(opts, (err) => {
	if (err) {
		throw (err);
	}
	console.log('Jotting is now running on port ' + opts.port);
});





