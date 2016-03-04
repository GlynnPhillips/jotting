'use strict';

var assert = require('proclaim');
var sinon = require('sinon');
var options = require('../../config');
var request = require('request');
var database = require('../../database');
var posts, pages;


describe('Public routes', function() {
	before(function(done) {
		database.databaseConnection({opts:options});
		posts = require('../../models/posts').configureModels;
		pages = require('../../routes/pages');
		done();
	});
	describe('', function() {
		var req, res, spy;
		beforeEach(function() {
			req = res = {};
			spy = res.render = sinon.spy();
		});

		it('should call render for the home page', function() {
			
			pages.index(req, res);
			
			assert.isTrue(spy.calledOnce);
		});	
		
		it('should call render for the about us page', function() {
			pages.us(req, res);

			assert.isTrue(spy.calledOnce);
		});	
		
		it('should call render for the support page', function() {
			pages.support(req, res);

			assert.isTrue(spy.calledOnce);
		});	
		
		it('should call render for the kit page', function() {
			pages.kit(req, res);

			assert.isTrue(spy.calledOnce);
		});	

		it('should call render for the live progress page', function() {
			pages.live(req, res);

			assert.isTrue(spy.calledOnce);
		});	
		
		it('should call render for the donation page', function() {
			var body = JSON.stringify({
				personalUrl: 'http://www.exampleurl.com',
				pageDetails: [
					{
						donationTotalNet: 100,
						targetAmount: 1000,
					}
				]
			});

			sinon.stub(request, 'get').yields(null, {statusCode: 200}, body);
			pages.donate(req, res);

			assert.isTrue(spy.calledOnce);
		});	
	});
	after(function() {
		database.databaseCloseConnection();
	});
});
