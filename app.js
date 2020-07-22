/** Express app for jobly. */

const express = require('express');
const ExpressError = require('./helpers/expressError');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const companyRoutes = require('./routes/companies');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');

const app = express();
// parse json
app.use(express.json());
// add helmet
app.use(helmet());
// add logging system
app.use(morgan('tiny'));

// login
app.post('/login', async (req, res, next) => {
	try {
		// authenticate user - if false, return invalid login, 
		// if true, get the user, store username, is_admin values in a jwt
		// return the JSON {token} 
	} catch (e) {
		return next(e);
	}
});

// company routes
app.use('/companies', companyRoutes);
// job routes
app.use('/jobs', jobRoutes);
// user routes
app.use('/users', userRoutes);

/** 404 handler */

app.use(function(req, res, next) {
	const err = new ExpressError('Not Found', 404);

	// pass the error to the next piece of middleware
	return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.error(err.stack);

	return res.json({
		status  : err.status,
		message : err.message
	});
});

module.exports = app;
