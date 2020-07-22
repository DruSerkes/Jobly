process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const Job = require('../../models/job');
const Company = require('../../models/company');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

let j1;
let c1;
let u1;
let u1Token;
describe('Job routes test', () => {
	beforeEach(async () => {
		await db.query('DELETE FROM companies');
		await db.query('DELETE FROM jobs');
		await db.query('DELETE FROM users');
		const companyData = { handle: 'test', name: 'test corp' };
		const jobData = { title: 'tester', salary: 100, equity: 0.666, company_handle: 'test' };
		const userData = {
			username   : 'testuser',
			password   : 'testword',
			first_name : 'test',
			last_name  : 'user',
			email      : 'test@test.com'
		};

		c1 = await Company.create(companyData.handle, companyData.name);
		j1 = await Job.create(jobData);
		u1 = await User.create(userData);
		u1Token = jwt.sign({ username: u1.username, is_admin: u1.is_admin }, SECRET_KEY);
		console.log(j1);
	});

	afterAll(async () => {
		await db.end();
	});

	describe('GET /jobs', () => {
		test('can get all jobs', async () => {
			const response = await request(app).get('/jobs');
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				jobs : [
					{
						company_handle : 'test',
						title          : 'tester'
					}
				]
			});
		});
	});

	describe('GET /jobs/:id', () => {
		test('can get a single job', async () => {
			const response = await request(app).get(`/jobs/${j1.id}`);
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				job : {
					id             : expect.any(Number),
					title          : 'tester',
					salary         : 100,
					equity         : 0.666,
					company_handle : 'test',
					date_posted    : expect.any(String)
				}
			});
		});

		test('invalid id returns 404', async () => {
			const response = await request(app).get(`/jobs/0`);
			expect(response.status).toBe(404);
		});
	});

	describe('POST /jobs', () => {
		test('can create a job', async () => {
			const response = await request(app).post(`/jobs`).send({
				title          : 'tester2',
				salary         : 1001,
				equity         : 0.667,
				company_handle : 'test',
				token          : u1Token
			});
			expect(response.status).toBe(201);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				job : {
					id             : expect.any(Number),
					title          : 'tester2',
					salary         : 1001,
					equity         : 0.667,
					company_handle : 'test',
					date_posted    : expect.any(String)
				}
			});
		});

		test('data with missing fields returns 400 error', async () => {
			const response = await request(app).post(`/jobs`).send({ title: 'tester2' });
			expect(response.status).toBe(400);
		});
	});

	describe('PATCH /jobs/:id', () => {
		test('can update single company', async () => {
			const response = await request(app).patch(`/jobs/${j1.id}`).send({
				title          : 'updater',
				salary         : 1001,
				equity         : 0.667,
				company_handle : 'test',
				token          : u1Token
			});
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				job : {
					id             : j1.id,
					title          : 'updater',
					salary         : 1001,
					equity         : 0.667,
					company_handle : 'test',
					date_posted    : expect.any(String)
				}
			});
		});

		test('invalid id returns 404', async () => {
			const response = await request(app).put(`/companies/0`).send({
				title          : 'updater',
				salary         : 1001,
				equity         : 0.667,
				company_handle : 'test'
			});
			expect(response.status).toBe(404);
		});

		test('invalid data returns 400 error', async () => {
			const response = await request(app).patch(`/jobs/${j1.id}`).send({
				title  : 'updater',
				salary : '1001',
				equity : 1
			});
			expect(response.status).toBe(400);
		});
	});

	describe('DELETE /jobs/:id', () => {
		test('can delete a book', async () => {
			const response = await request(app).delete(`/jobs/${j1.id}`);
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({ message: 'Job deleted' });
		});
	});

	describe('POST /jobs/:id/apply', () => {
		test('can apply for job', async () => {
			const response = await request(app).post(`/jobs/${j1.id}/apply`).send({ token: u1Token, state: 'testing' });
			expect(response.status).toBe(201);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({ message: 'testing' });
		});
	});
});
