const getSqlParameters = require('../../helpers/getSqlParameters');

describe('getSqlParameters test', () => {
	it('should return a string of parameters for SQL query', () => {
		const result = getSqlParameters('companies', { search: 'test', min_employees: 1, max_employees: 10 });
		expect(result).toEqual(`WHERE name ILIKE 'test' AND num_employees >= 1 AND num_employees <= 10`);
	});
});
