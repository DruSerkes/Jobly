// TODO add a unit test for helper function getSqlParameters

const getSqlParameters = require('../../helpers/getSqlParameters');
const { expectCt } = require('helmet');

describe('getSqlParameters test', () => {
	it('should return a string of parameters for SQL query', () => {
		const result = getSqlParameters({ search: 'test', min_employees: 1, max_employees: 10 });
		expect(result).toEqual(`WHERE name ILIKE 'test' AND num_employees >= 1 AND num_employees <= 10`);
	});
});
