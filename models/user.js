const db = require('../db');
const ExpressError = require('../helpers/expressError');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');

class User {
	/** get all users 
     * 
     * @returns {users : [{username, first_name, last_name, email}, ...]}
     */

	static async getAll() {
		const results = await db.query(`SELECT username, first_name, last_name, email FROM users`);
		if (!results.rows.length) throw new ExpressError(`No users found`, 404);
		return results.rows;
	}

	/** get a user by username
     * 
     * @param username (str) 
     * 
     * @returns {user : {username, first_name, last_name, email, photo_url, is_admin, job : { id, title, salary, equity, company_handle, date_posted, state } } }  
     */
	static async getByUsername(username) {
		const userResult = await db.query(`SELECT * FROM users WHERE username = $1`, [ username ]);
		if (!userResult.rows.length) throw new ExpressError(`User not found`, 404);
		const user = userResult.rows[0];
		delete user.password;
		const jobResult = await db.query(
			`SELECT j.id, j.title, j.salary, j.equity, j.company_handle, j.date_posted, a.state FROM jobs AS j
			JOIN applications AS a
			ON j.id = a.job_id
			JOIN users AS u
			ON u.username = a.username
			WHERE u.username = $1
			`,
			[ user.username ]
		);
		user.jobs = jobResult.rows;

		return user;
	}

	/** create a user 
     * 
     * @param {*} userData (obj) 
     * - contains username (str), password (str), first_name (str), last_name (str), email (str unique)
     * @returns {user : {username, first_name, last_name, email, photo_url, is_admin} }
     */
	static async create({ username, password, first_name, last_name, email }) {
		if (!username || !password || !first_name || !last_name || !email)
			throw new ExpressError('Missing required data', 400);

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO users (username, password, first_name, last_name, email)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[ username, hashedPassword, first_name, last_name, email ]
		);
		const user = result.rows[0];
		delete user.password;

		return user;
	}

	/** Remove a user 
     * 
     * @param {*} username (str)
     * @returns nothing
     */
	static async remove(username) {
		const result = await db.query(`DELETE FROM users WHERE username=$1 RETURNING username`, [ username ]);
		if (!result.rows.length) throw new ExpressError(`user not found`, 404);
	}

	/** Update a user 
     * 
     * @param {*} items object (req.body) with optional params: username (str), first_name (str), last_name (str), email (str unique), photo_url (str)
     * @param {*} username (str) 
     * 
     * @returns {user : {username, first_name, last_name, email, photo_url} }
     */
	static async update(items, username) {
		const { query, values } = sqlForPartialUpdate('users', items, 'username', username);
		const result = await db.query(query, values);
		if (!result.rows.length) throw new ExpressError(`User ${username} not found `, 404);
		delete result.rows[0].password;
		return result.rows[0];
	}

	/** Authenticate a user
	 * 
	 * @param {*} username (str)
	 * @param {*} password (str)
	 * @returns boolean 
	 */
	static async authenticate(username, password) {
		if (!username || !password) throw new ExpressError('Username/Password Required', 400);

		const result = await db.query(
			`SELECT username, password
			FROM users 
			WHERE username = $1`,
			[ username ]
		);

		if (!result.rows.length) throw new ExpressError(`User ${username} not found`, 404);

		const user = result.rows[0];

		return await bcrypt.compare(password, user.password);
	}

	/** Creates an admin user 
	 * 
	 * @param {*} userData (obj) 
	 * - contains username (str), password (str), first_name (str), last_name (str), email (str unique)
     * @returns {user : {username, first_name, last_name, email, photo_url, is_admin} }
	 */
	static async makeAdmin({ username, password, first_name, last_name, email }) {
		if (!username) throw new ExpressError('Username required', 400);

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`INSERT INTO users (username, password, first_name, last_name, email, is_admin)
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
			[ username, hashedPassword, first_name, last_name, email, true ]
		);

		return result.rows[0];
	}
}

module.exports = User;
