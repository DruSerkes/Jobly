const db = require('../db');
const ExpressError = require('../helpers/expressError');
const getSqlParameters = require('../helpers/getSqlParameters');
const partialUpdate = require('../helpers/partialUpdate');

class Company {
	/** get all companies 
     * 
     * - params (optional) - list of query params: search, min_employees, max_employees 
     * - returns [{handle, name}, ...] 
     */

	static async getAll(params = {}) {
		if (!Object.entries(params).length) {
			const results = await db.query(`SELECT handle, name FROM companies`);
			return results.rows;
		}
		const parameters = getSqlParameters(params);
		const results = await db.query(`SELECT handle, name FROM companies ${parameters}`);
		return results.rows;
	}
}

// CREATE TABLE companies
// (
//     handle text PRIMARY KEY,
//     name text NOT NULL UNIQUE,
//     num_employees int,
//     description text,
//     logo_url text,
//     join_at timestamp DEFAULT CURRENT_TIMESTAMP
// );

module.exports = Company;
