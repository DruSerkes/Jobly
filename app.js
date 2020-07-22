/** Express app for jobly. */

const express = require('express');
const ExpressError = require('./helpers/expressError');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const { authenticateJWT } = require('./middleware/auth');
const companyRoutes = require('./routes/companies');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const { SECRET_KEY } = require('./config');

const app = express();
// parse json
app.use(express.json());
// add basic security
app.use(helmet());
// add logging system
app.use(morgan('tiny'));

app.use(authenticateJWT);

/** Login returns JWT to user */
app.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		if (!await User.authenticate(username, password)) return res.status(401).json({ message: 'invalid login' });
		const user = await User.getByUsername(username);
		const token = jwt.sign({ username: user.username, is_admin: user.is_admin }, SECRET_KEY);
		return res.json({ token });
	} catch (e) {
		return next(e);
	}
});

// company, job, user routing
app.use('/companies', companyRoutes);
app.use('/jobs', jobRoutes);
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
