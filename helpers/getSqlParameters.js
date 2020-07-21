/**
 * Generate SQL query parameters
 * @param table name of table you're interacting with
 * - params: object with up to 3 keys
 * -- search: str
 * -- min_employees: int
 * -- max_employees: int 
 * -- min_salary: float
 * -- min_equity: float 
 * 
 * Returns string containing search params
 */

function getSqlParameters(table, params) {
	// error handling for invalid min/max employees
	if (params.min_employees && params.max_employees && params.max_employees < params.min_employees) {
		throw new ExpressError('Invalid parameters - check max_employees is not less than min_employees', 400);
	}
	// store all of the params in paramList
	let paramList = [];
	let parameters;
	for (let item of Object.entries(params)) {
		if (table === 'companies') {
			if (item[0] === 'search') paramList.push(`name ILIKE '${item[1]}'`);
			if (item[0] === 'min_employees') paramList.push(`num_employees >= ${item[1]}`);
			if (item[0] === 'max_employees') paramList.push(`num_employees <= ${item[1]}`);
		} else if (table === 'jobs') {
			if (item[0] === 'search') paramList.push(`title ILIKE '${item[1]}'`);
			if (item[0] === 'min_salary') paramList.push(`salary >= ${item[1]}`);
			if (item[0] === 'min_equity') paramList.push(`equity >= ${item[1]}`);
		}
	}
	parameters = `WHERE ${paramList.join(' AND ')}`;
	return parameters;
}

module.exports = getSqlParameters;
