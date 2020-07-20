process.env.NODE_ENV = 'test';
const partialUpdate = require('../../helpers/partialUpdate');

describe('partialUpdate()', () => {
	it('should generate a proper partial update query with just 1 field', function() {
		// FIXME: write real tests!
		const result = partialUpdate(
			'users',
			{ happy: true, height: 72, home: 'where the heart is' },
			'username',
			'test'
		);
		expect(result).toBeInstanceOf(Object);
		expect(result.query).toBeTruthy();
		expect(result.query).toEqual(`UPDATE users SET happy=$1, height=$2, home=$3 WHERE username=$4 RETURNING *`);
		expect(result.values).toBeTruthy();
		expect(result.values).toBeInstanceOf(Array);
		expect(result.values).toEqual([ true, 72, 'where the heart is', 'test' ]);
	});
});
