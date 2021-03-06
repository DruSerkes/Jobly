process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Company = require('../../models/company');
const User = require('../../models/user');
const Job = require('../../models/job');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');

let c1;
let u1;
let j1;
let u1Token;
describe('Company routes test', () => {
	beforeEach(async () => {
		await db.query('DELETE FROM companies');
		await db.query('DELETE FROM jobs');
		await db.query('DELETE FROM users');
		await db.query('DELETE FROM applications');
		const companyData = { handle: 'test', name: 'test corp' };
		const jobData = { title: 'tester', salary: 100, equity: 0.666, company_handle: 'test' };
		const userData = {
			username   : 'testuser',
			password   : 'testword',
			first_name : 'test',
			last_name  : 'user',
			email      : 'test@test.com'
		};
		u1 = await User.makeAdmin(userData);
		u1Token = jwt.sign({ username: u1.username, is_admin: u1.is_admin }, SECRET_KEY);
		c1 = await Company.create(companyData.handle, companyData.name);
		j1 = await Job.create(jobData);
	});
	afterEach(async () => {
		await db.query('DELETE FROM companies');
		await db.query('DELETE FROM jobs');
		await db.query('DELETE FROM users');
		await db.query('DELETE FROM applications');
	});

	afterAll(async () => {
		await db.end();
	});

	describe('GET /companies', () => {
		test('can get all companies', async () => {
			const response = await request(app).get('/companies').send({ token: u1Token });
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				companies : [
					{
						handle : c1.handle,
						name   : c1.name
					}
				]
			});
		});
	});

	describe('GET /companies/:handle', () => {
		test('can get a single company', async () => {
			const response = await request(app).get(`/companies/${c1.handle}`).send({ token: u1Token });
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				company : {
					handle        : c1.handle,
					name          : c1.name,
					num_employees : null,
					description   : null,
					logo_url      : null,
					join_at       : expect.any(String),
					jobs          : expect.any(Array)
				}
			});
		});

		test('invalid handle returns 404', async () => {
			const response = await request(app).get(`/companies/invalid`).send({ token: u1Token });
			expect(response.status).toBe(404);
		});
	});

	describe('POST /companies', () => {
		test('can create a company', async () => {
			const response = await request(app).post(`/companies`).send({
				handle : 'test2',
				name   : 'test company2',
				token  : u1Token
			});
			expect(response.status).toBe(201);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				company : {
					handle : 'test2',
					name   : 'test company2'
				}
			});
		});

		test('data with missing fields returns 400 error', async () => {
			const response = await request(app).post(`/companies`).send({ handle: 'mehh', token: u1Token });
			expect(response.status).toBe(400);
		});
	});

	describe('PATCH /companies/:handle', () => {
		test('can update single company', async () => {
			const response = await request(app).patch(`/companies/${c1.handle}`).send({
				name          : 'test company patched',
				num_employees : 666,
				description   : 'a company made for testing',
				logo_url      : 'https://test.com/test/img.png',
				token         : u1Token
			});
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				company : {
					handle        : c1.handle,
					name          : 'test company patched',
					num_employees : 666,
					description   : 'a company made for testing',
					logo_url      : 'https://test.com/test/img.png',
					join_at       : expect.any(String)
				}
			});
		});

		test('invalid handle returns 404', async () => {
			const response = await request(app).put(`/companies/invalid`).send({
				name          : 'test company patched',
				num_employees : 666,
				description   : 'a company made for testing',
				logo_url      : 'https://test.com/test/img.png',
				token         : u1Token
			});
			expect(response.status).toBe(404);
		});

		test('invalid data returns 400 error', async () => {
			const response = await request(app).patch(`/companies/${c1.handle}`).send({
				name          : 'test company patched',
				num_employees : '666',
				description   : 3,
				logo_url      : 'https://test.com/test/img.png',
				token         : u1Token
			});
			expect(response.status).toBe(400);
		});
	});

	describe('DELETE /companies/:handle', () => {
		test('can delete a company', async () => {
			const response = await request(app).delete(`/companies/${c1.handle}`).send({ token: u1Token });
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({ message: 'Company successfully removed' });
		});
	});
});
