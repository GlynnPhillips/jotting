'use strict';


// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
module.exports = {
	env: process.env.NODE_ENV || 'dev',
	credentials: process.env.CREDENTIALS,
	db: process.env.MONGO_URL,
	secret: process.env.SECRET,
	store: process.env.TEMP_DIR || __dirname + '/uploads',
	imagePath: process.env.IMAGE_PATH,
	port: process.env.PORT || 3000,
	neilDonateApi: process.env.NEIL_DONATE_API || 'http://example.com',
	timDonateApi: process.env.TIM_DONATE_APIi || 'http://example.com',
	twitterKey: process.env.TWITTER_KEY,
	twitterSecret: process.env.TWITTER_SECRET,
	twitterAccess: process.env.TWITTER_ACCESS,
	twitterAccessSecret: process.env.TWITTER_ACCESS_SECRET,
	storeKey: process.env.STORE_KEY,
	storeSecret: process.env.STORE_SECRET,
	storeName: process.env.STORE_NAME
};
// jscs:enable requireCamelCaseOrUpperCaseIdentifiers
