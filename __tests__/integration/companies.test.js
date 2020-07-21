process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Company = require('../../models/company');

let c1;
describe('Company routes test', () => {
	beforeEach(async () => {
		await db.query('DELETE FROM companies');

		c1 = await Company.create('test', 'test company');
	});

	afterAll(async () => {
		await db.end();
	});
});
