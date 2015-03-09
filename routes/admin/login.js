exports.index = function (req, res){
	res.render('admin/login');
};

exports.authenticate = function (req, res){
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
};