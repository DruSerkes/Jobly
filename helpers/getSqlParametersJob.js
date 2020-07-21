/**
 * Generate SQL search query parameters for jobs
 * 
 * - params: object with up to 3 keys of 
 * -- search: str
 * -- min_salary: float
 * -- min_equity: float 
 * 
 * Returns string containing search params
 */

function getSqlParametersJob(params) {
	// store all of the params in paramList
	let paramList = [];
	let parameters;
	for (let item of Object.entries(params)) {
		if (item[0] === 'search') paramList.push(`title ILIKE '${item[1]}'`);
		if (item[0] === 'min_salary') paramList.push(`salary >= ${item[1]}`);
		if (item[0] === 'min_equity') paramList.push(`equity <= ${item[1]}`);
	}
	parameters = `WHERE ${paramList.join(' AND ')}`;
	return parameters;
}

module.exports = getSqlParametersJob;
