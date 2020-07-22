const db = require('../db');
const ExpressError = require('../helpers/expressError');
const getSqlParameters = require('../helpers/getSqlParameters');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

class Job {
	/** get all jobs 
     * 
     * @param params (optional) - list of query params: 
     * -- search: str 
     * -- min_salary: float 
     * -- min_equity: float
     * @returns [{company_handle, title}, ...]
     */

	static async getAll(params = {}) {
		if (!Object.entries(params).length) {
			const results = await db.query(`SELECT company_handle, title FROM jobs`);
			if (!results.rows.length) throw new ExpressError(`No jobs found`, 404);
			return results.rows;
		}
		const parameters = getSqlParameters('jobs', params);
		const results = await db.query(`SELECT company_handle, title FROM jobs ${parameters}`);
		if (!results.rows.length) throw new ExpressError(`No job found`, 404);
		return results.rows;
	}

	/** get a job by id
     * 
     * @param id (int) job id
     * 
     * @returns job {id, title, salary, equity, company_handle, date_posted}  
     */
	static async getById(id) {
		const result = await db.query(`SELECT * FROM jobs WHERE id = $1`, [ id ]);

		if (!result.rows.length) throw new ExpressError(`No job found with id: ${id}`, 404);

		return result.rows[0];
	}

	/** create a job 
     * 
     * @param {*} jobData (obj) 
     * - contains title (str), salary (float), equity (float), company_handle (str references companies)
     * @returns job {id, title, salary, equity, company_handle, date_posted} 
     */
	static async create({ title, salary, equity, company_handle }) {
		if (!title || !salary || !equity || !company_handle) throw new ExpressError('Missing required data', 400);

		const result = await db.query(
			`INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4) RETURNING *`,
			[ title, salary, equity, company_handle ]
		);
		return result.rows[0];
	}

	/** Remove a job 
     * 
     * @param {*} id (int) id to identify which job to remove
     * @returns nothing
     */
	static async remove(id) {
		const result = await db.query(`DELETE FROM jobs WHERE id=$1 RETURNING id`, [ id ]);

		if (!result.rows.length) {
			throw new ExpressError(`Job with id ${id} not found`, 404);
		}
	}

	/** Update a job 
     * 
     * @param {*} items object (req.body) with optional params: title (str), salary (float), equity (float), company_handle (str references companies)
     * @param {*} id (int) job id
     * 
     * @returns updated job {id, title, salary, equity, company_handle, date_posted} 
     */
	static async update(items, id) {
		const { query, values } = sqlForPartialUpdate('jobs', items, 'id', id);
		const result = await db.query(query, values);
		if (!result.rows.length) throw new ExpressError(`Job not found with id ${id}`, 404);
		return result.rows[0];
	}

	/** Updates the state of a job application
	 * 
	 * @param {*} username (str) username for this user	 
	 * @param {*} job_id (int) id for this job
	 * @param {*} state (str) state of this application
	 * @returns updated state
	 */
	static async apply(username, job_id, state) {
		if (!username || !job_id || !state) throw new ExpressError('Missing required data', 400);
		const stateOptions = [ 'interested', 'applied', 'accepted', 'rejected' ];
		if (!stateOptions.includes(state))
			throw new ExpressError(`Invalid state. Must be 'interested', 'applied', 'accepted', 'rejected'`, 400);
		const result = await db.query(
			`INSERT INTO applications (username, job_id, state) 
			VALUES ($1, $2, $3) RETURNING state`,
			[ username, job_id, state ]
		);
		const newState = result.rows[0].state;
		return newState;
	}
}

module.exports = Job;
