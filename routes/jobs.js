const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const ExpressError = require('../helpers/expressError');
// const jsonschema = require('jsonschema');
// const addJobSchema = require('../schemas/createJobSchema.json');
// const updateJobSchema = require('../schemas/updateJobSchema.json');

// TODO refactor routes to work for jobs

/** GET /jobs - get all jobs  */

router.get('/', async (req, res, next) => {
	try {
		const jobs = await Job.getAll();
		return res.json({ jobs });
	} catch (e) {
		return next(e);
	}
});

/** POST /jobs - create a new job */

router.post('/', async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, addCompanySchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const { handle, name } = req.body;
		const job = await Job.create(handle, name);

		return res.status(201).json({ job });
	} catch (e) {
		return next(e);
	}
});

/** GET /jobs/:id - get a single job  */

router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const job = await Job.getById(id);
		return res.json({ job });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /jobs/:handle - update a job  */

router.patch('/:id', async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, updateJobSchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const { id } = req.params;
		const job = await Job.update(req.body, id);
		return res.json({ job });
	} catch (e) {
		return next(e);
	}
});

/** DELETE /jobs/:id - delete a job  */

router.delete('/:id', (req, res, next) => {
	try {
		const { id } = req.params;
		Job.remove(id);
		return res.json({ message: 'Job deleted' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
