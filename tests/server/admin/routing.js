'use strict';

var assert = require('proclaim');
var sinon = require('sinon');
var options = require('../../../config');
var database = require('../../../database');
var posts, postRoutes;


describe('Admin routes', function() {
	before(function(done) {
		database.databaseConnection({opts:options});
		posts = require('../../../models/posts').configureModels;
		postRoutes = require('../../../routes/admin/posts');
		done();
	});
	describe('The post editing page', function() {
		var req, res, spy;
		beforeEach(function() {
			req = res = {};
			req.params = {};
			req.params.id = null;
			spy = res.render = sinon.spy();
		});

		it('should call the render if its a brand new post', function() {	
			sinon.stub(posts, 'find').yields(null, {});
			postRoutes.new(req, res);
			
			assert.isTrue(spy.calledOnce);
		});	
	});
	after(function() {
		database.databaseCloseConnection();
	});
});
