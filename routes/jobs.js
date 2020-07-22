const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const ExpressError = require('../helpers/expressError');
const { ensureLoggedIn, ensureIsAdmin } = require('../middleware/auth');
const jsonschema = require('jsonschema');
const addJobSchema = require('../schemas/createJobSchema.json');
const updateJobSchema = require('../schemas/updateJobSchema.json');

/** GET /jobs - get all jobs  */

router.get('/', ensureLoggedIn, async (req, res, next) => {
	try {
		const jobs = await Job.getAll();
		return res.json({ jobs });
	} catch (e) {
		return next(e);
	}
});

/** POST /jobs - create a new job */

router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, addJobSchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const job = await Job.create(req.body);

		return res.status(201).json({ job });
	} catch (e) {
		return next(e);
	}
});

/** GET /jobs/:id - get a single job  */

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
	try {
		const { id } = req.params;
		const job = await Job.getById(id);
		return res.json({ job });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /jobs/:handle - update a job  */

router.patch('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, updateJobSchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const { id } = req.params;
		const jobData = req.body;
		delete jobData.token;
		const job = await Job.update(jobData, id);
		return res.json({ job });
	} catch (e) {
		return next(e);
	}
});

/** DELETE /jobs/:id - delete a job  */

router.delete('/:id', ensureIsAdmin, async (req, res, next) => {
	try {
		const { id } = req.params;
		await Job.remove(id);
		return res.json({ message: 'Job deleted' });
	} catch (e) {
		return next(e);
	}
});

/** POST /jobs/:id/apply - apply for a job */

router.post('/:id/apply', ensureLoggedIn, async (req, res, next) => {
	try {
		const { id } = req.params;
		const { username } = req.user;
		const { state } = req.body;
		const newState = await Job.apply(username, id, state);
		return res.status(201).json({ message: newState });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
