const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const jsonschema = require('jsonschema');
const addCompanySchema = require('../schemas/createSchema.json');
const updateCompanySchema = require('../schemas/updateSchema.json');
const ExpressError = require('../helpers/expressError');
const { ensureLoggedIn, ensureIsAdmin } = require('../middleware/auth');

/** GET /companies - get all companies  */

router.get('/', ensureLoggedIn, async (req, res, next) => {
	try {
		const companies = await Company.getAll();
		return res.json({ companies });
	} catch (e) {
		return next(e);
	}
});

/** POST /companies - create a new company */

router.post('/', ensureIsAdmin, async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, addCompanySchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const { handle, name } = req.body;
		const company = await Company.create(handle, name);

		return res.status(201).json({ company });
	} catch (e) {
		return next(e);
	}
});

/** GET /companies/:handle - get a single company  */

router.get('/:handle', ensureLoggedIn, async (req, res, next) => {
	try {
		const { handle } = req.params;
		const company = await Company.getByHandle(handle);
		return res.json({ company });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /companies/:handle - update a company  */

router.patch('/:handle', ensureIsAdmin, async (req, res, next) => {
	try {
		const schema = jsonschema.validate(req.body, updateCompanySchema);
		if (!schema.valid) throw new ExpressError('Invalid data', 400);

		const { handle } = req.params;
		const company = await Company.update(req.body, handle.toLowerCase());
		return res.json({ company });
	} catch (e) {
		return next(e);
	}
});

/** DELETE /companies/:handle - delete a company  */

router.delete('/:handle', ensureIsAdmin, (req, res, next) => {
	try {
		const { handle } = req.params;
		Company.remove(handle);
		return res.json({ message: 'Company successfully removed' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
