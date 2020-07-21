const express = require('express');
const router = express.Router();
const Company = require('../models/company');

/** GET /companies - get all companies  */

router.get('/', async (req, res, next) => {
	try {
		const companies = await Company.getAll();
		return res.json({ companies });
	} catch (e) {
		return next(e);
	}
});

/** POST /companies - create a new company */

router.post('/', (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});

/** GET /companies/:handle - get a single company  */

router.get('/:handle', async (req, res, next) => {
	try {
		const { handle } = req.params;
		const company = await Company.getByHandle(handle);
		return res.json({ company });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /companies/:handle - update a company  */

router.patch('/:handle', (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});

/** DELETE /companies/:handle - delete a company  */

router.delete('/:handle', (req, res, next) => {
	try {
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
