const db = require('../db');
const ExpressError = require('../helpers/expressError');
const getSqlParameters = require('../helpers/getSqlParameters');
const partialUpdate = require('../helpers/partialUpdate');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class Company {
	/** get all companies 
     * 
     * @param params (optional) - list of query params: search, min_employees, max_employees 
     * @returns [{handle, name}, ...] 
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

	/** get a company by handle 
     * 
     * @param handle (str) matching company handle
     * 
     * @returns a single company from db with matching handle 
     */
	static async getByHandle(handle) {
		const result = await db.query(`SELECT * FROM companies WHERE handle ILIKE $1`, [ handle.toLowerCase() ]);

		if (!result.rows.length) {
			throw new ExpressError(`No company found with handle: ${handle}`, 404);
		}

		return result.rows[0];
	}

	/** create a company 
     * 
     * @param {*} handle (str) company handle
     * @param {*} name (str) company name
     * @returns created company from DB
     */
	static async create(handle, name) {
		if (!handle || !name) throw new ExpressError('Missing required data', 400);

		const result = await db.query(
			`INSERT INTO companies (handle, name)
            VALUES ($1, $2) RETURNING handle, name`,
			[ handle.toLowerCase(), name ]
		);
		return result.rows[0];
	}

	/** Remove a company 
     * 
     * @param {*} handle a company handle to identify which company to remove
     * @returns nothing
     */
	static async remove(handle) {
		const result = await db.query(`DELETE FROM companies WHERE handle=$1 RETURNING handle`, [ handle ]);

		if (!result.rows.length) {
			throw new ExpressError(`Company with handle ${handle} not found`, 404);
		}
	}

	/** Update a company 
     * 
     * @param {*} items object (req.body) with optional params: name (str), num_employees (int), description (text), logo_url (text)  
     * @param {*} handle handle for company to update 
     * @returns updated company 
     */
	static async update(items, handle) {
		const { query, values } = sqlForPartialUpdate('companies', items, 'handle', handle);
		const result = await db.query(query, values);
		if (!result.rows.length) throw new ExpressError(`Company not found with handle ${handle}`, 404);
		return result.rows[0];
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
