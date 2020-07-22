process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const User = require('../../models/user');

let u1;
describe('User routes test', () => {
	beforeEach(async () => {
		await db.query('DELETE FROM users');
		const userData = {
			username   : 'testuser',
			password   : 'testword',
			first_name : 'test',
			last_name  : 'user',
			email      : 'test@test.com'
		};
		u1 = await User.create(userData);
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
					is_admin   : false
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
				username   : 'test user 2',
				password   : 'testword2',
				first_name : 'test 2',
				last_name  : 'user 2',
				email      : 'test2@test.com'
			});
			expect(response.status).toBe(201);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({
				user : {
					username   : 'test user 2',
					first_name : 'test 2',
					last_name  : 'user 2',
					email      : 'test2@test.com',
					photo_url  : null,
					is_admin   : false
				}
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
				photo_url  : 'https://thisisaurl.com/image.png'
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
					is_admin   : false
				}
			});
		});

		test('invalid username returns 404', async () => {
			const response = await request(app).patch(`/users/invalid`).send({
				username   : 'testusernameedit',
				first_name : 'edit',
				last_name  : 'name',
				email      : 'edit@test.com',
				photo_url  : 'https://thisisaurl.com/image.png'
			});
			expect(response.status).toBe(404);
		});

		test('invalid data returns 400 error', async () => {
			const response = await request(app).patch(`/users/${u1.username}`).send({
				username  : 13,
				last_name : true,
				email     : 'thisisnotanemail',
				photo_url : 'isthisaurl?!?!?'
			});
			expect(response.status).toBe(400);
		});
	});

	describe('DELETE /users/:username', () => {
		test('can delete a book', async () => {
			const response = await request(app).delete(`/users/${u1.username}`);
			expect(response.status).toBe(200);
			expect(response.body).toBeInstanceOf(Object);
			expect(response.body).toEqual({ message: 'User deleted' });
		});
	});
});
