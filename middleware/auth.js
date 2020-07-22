/** Middleware for handling req authorization for routes. */

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
	try {
		const { token } = req.body;
		const payload = jwt.verify(token, SECRET_KEY);
		req.user = payload; // create a current user
		return next();
	} catch (e) {
		return next();
	}
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
	if (!req.user) {
		return next({ status: 401, message: 'Unauthorized' });
	} else {
		return next();
	}
}

/** Middleware: Requires correct username. */

function ensureCorrectUser(req, res, next) {
	try {
		if (req.user.username === req.params.username) {
			return next();
		} else {
			return next({ status: 401, message: 'Unauthorized' });
		}
	} catch (err) {
		// errors would happen here if we made a request and req.user is undefined
		return next({ status: 401, message: 'Unauthorized' });
	}
}

function ensureIsAdmin(req, res, next) {
	try {
		if (req.user.is_admin) return next();
		return next({ status: 401, message: 'Unauthorized' });
	} catch (e) {
		return next({ status: 401, message: 'Unauthorized' });
	}
}

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureCorrectUser,
	ensureIsAdmin
};
