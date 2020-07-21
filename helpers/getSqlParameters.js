/**
 * Generate SQL query parameters
 * 
 * - params: object with up to 3 keys of 
 * -- search: str
 * -- min_employees: int
 * -- max_employees: int 
 * 
 * Returns string containing search params
 */

function getSqlParameters(params) {
	// error handling for invalid min/max employees
	if (params.min_employees && params.max_employees && params.max_employees < params.min_employees) {
		throw new ExpressError('Invalid parameters - check max_employees is not less than min_employees', 400);
	}
	// store all of the params in paramList
	let paramList = [];
	let parameters;
	for (let item of Object.entries(params)) {
		if (item[0] === 'search') paramList.push(`name ILIKE '${item[1]}'`);
		if (item[0] === 'min_employees') paramList.push(`num_employees >= ${item[1]}`);
		if (item[0] === 'max_employees') paramList.push(`num_employees <= ${item[1]}`);
	}
	parameters = `WHERE ${paramList.join(' AND ')}`;
	return parameters;
}

module.exports = getSqlParameters;
