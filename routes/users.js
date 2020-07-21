const express = require('express');
const router = express.Router();
const User = require('../models/user');
const ExpressError = require('../helpers/expressError');
const jsonschema = require('jsonschema');
const addUserSchema = require('../schemas/createUserSchema.json');
const updateUserSchema = require('../schemas/updateUserSchema.json');

/** GET /users - get all users  */

router.get('/', async (req, res, next) => {
	try {
		const users = await User.getAll();
		return res.json({ users });
	} catch (e) {
		return next(e);
	}
});

/** POST /users - create a new user */

router.post('/', async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, addUserSchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const user = await User.create(req.body);

		return res.status(201).json({ user });
	} catch (e) {
		return next(e);
	}
});

/** GET /users/:username - get a single user  */

router.get('/:username', async (req, res, next) => {
	try {
		const { username } = req.params;
		const user = await User.getByUsername(username);
		return res.json({ user });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /users/:username - update a user  */

router.patch('/:username', async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, updateUserSchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const { username } = req.params;
		const user = await User.update(req.body, username);
		return res.json({ user });
	} catch (e) {
		return next(e);
	}
});

/** DELETE /users/:username - delete a user  */

router.delete('/:username', (req, res, next) => {
	try {
		const { username } = req.params;
		User.remove(username);
		return res.json({ message: 'User deleted' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
