process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const User = require('../../models/user');
const Job = require('../../models/job');
const Company = require('../../models/company');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');

let u1;
let u1Token;
let c1;
let j1;
describe('User routes test', () => {
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
		// console.log(`u1 ============== ${u1}`);
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

	describe('GET /users', () => {
		test('can get all users', async () => {
			const response = await request(app).get('/users');
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				users : [
					{
						username   : 'testuser',
						first_name : 'test',
						last_name  : 'user',
						email      : 'test@test.com'
					}
				]
			});
		});
	});

	describe('GET /users/:username', () => {
		test('can get a single user', async () => {
			const response = await request(app).get(`/users/${u1.username}`);
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				user : {
					username   : 'testuser',
					first_name : 'test',
					last_name  : 'user',
					email      : 'test@test.com',
					photo_url  : null,
					is_admin   : true,
					jobs       : expect.any(Object)
				}
			});
		});

		test('invalid username returns 404', async () => {
			const response = await request(app).get(`/users/invalid`);
			expect(response.status).toBe(404);
		});
	});

	describe('POST /users', () => {
		test('can create a user', async () => {
			const response = await request(app).post(`/users`).send({
				username   : 'testuser2',
				password   : 'testword2',
				first_name : 'test2',
				last_name  : 'user2',
				email      : 'test2@test.com'
			});
			expect(response.status).toBe(201);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				token : expect.any(String)
			});
		});

		test('data with missing fields returns 400 error', async () => {
			const response = await request(app).post(`/users`).send({ username: 'test2', password: 'test2word' });
			expect(response.status).toBe(400);
		});
	});

	describe('PATCH /users/:username', () => {
		test('can update single user', async () => {
			const response = await request(app).patch(`/users/${u1.username}`).send({
				username   : 'testusernameedit',
				first_name : 'edit',
				last_name  : 'name',
				email      : 'edit@test.com',
				photo_url  : 'https://thisisaurl.com/image.png',
				token      : u1Token
			});
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				user : {
					username   : 'testusernameedit',
					first_name : 'edit',
					last_name  : 'name',
					email      : 'edit@test.com',
					photo_url  : 'https://thisisaurl.com/image.png',
					is_admin   : true
				}
			});
		});

		test('update without token returns 401', async () => {
			const response = await request(app).patch(`/users/${u1.username}`).send({
				username   : 'testusernameedit2',
				first_name : 'edit',
				last_name  : 'name',
				email      : 'edit@test.com',
				photo_url  : 'https://thisisaurl.com/image.png'
			});
			expect(response.status).toBe(401);
		});

		test('invalid data returns 400 error', async () => {
			const response = await request(app).patch(`/users/${u1.username}`).send({
				username  : 13,
				last_name : true,
				email     : 'thisisnotanemail',
				photo_url : 'isthisaurl?!?!?',
				token     : u1Token
			});
			expect(response.status).toBe(400);
		});
	});

	describe('DELETE /users/:username', () => {
		test('can delete a user', async () => {
			const response = await request(app).delete(`/users/${u1.username}`).send({ token: u1Token });
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({ message: 'User deleted' });
		});
	});
});
