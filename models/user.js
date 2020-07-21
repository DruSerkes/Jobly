const db = require('../db');
const ExpressError = require('../helpers/expressError');
const getSqlParameters = require('../helpers/getSqlParameters');
const sqlForPartialUpdate = require('../helpers/partialUpdate');

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
     * @returns {user : {username, first_name, last_name, email, photo_url}}  
     */
	static async getByUsername(username) {
		const result = await db.query(
			`SELECT username, first_name, last_name, email, photo_url, FROM users WHERE username = $1`,
			[ username ]
		);

		if (!result.rows.length) throw new ExpressError(`User not found`, 404);

		return result.rows[0];
	}

	/** create a user 
     * 
     * @param {*} userData (obj) 
     * - contains username (str), password (str), first_name (str), last_name (str), email (str unique)
     * @returns {user : {username, first_name, last_name, email, photo_url} }
     */
	static async create({ username, password, first_name, last_name, email }) {
		if (!username || !password || !first_name || !last_name || !email)
			throw new ExpressError('Missing required data', 400);

		const result = await db.query(
			`INSERT INTO users (username, password, first_name, last_name, email)
            VALUES ($1, $2, $3, $4) RETURNING username, first_name, last_name, email, photo_url`,
			[ username, password, first_name, last_name, email ]
		);
		return result.rows[0];
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
		if (!result.rows.length) throw new ExpressError(`user not found with username ${username}`, 404);
		delete result.rows[0].password;
		return result.rows[0];
	}
}

module.exports = User;
