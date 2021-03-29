const db = require('../../config/db');

const crypto = require('crypto');
const { hash } = require('bcryptjs');

module.exports = {
	async findOne(filters) {
		let query = 'SELECT * FROM users';

		Object.keys(filters).map(key => {
			query = `${query}
				${key}
			`;
			Object.keys(filters[key]).map(field => {
				query = `${query} ${field} = '${filters[key][field]}'`;
			});
		});

		const results = await db.query(query);

		return results.rows[0];
	},
	async create(data) {
		const query = `
			INSERT INTO users (
				name,
				email,
				password,
				is_admin
			) VALUES ($1, $2, $3, $4)
			RETURNING id
		`;

		const password = crypto.randomBytes(3).toString('hex');
		const passwordHash = await hash(password, 8);

		let isAdmin = false;

		if (data.is_admin) {
			isAdmin = true;
		}

		const values = [
			data.name,
			data.email,
			passwordHash,
			isAdmin | 'false',
		];

		let results = await db.query(query, values);
		results = results.rows[0];

		return { results, password };
	},
	async update(id, fields) {
		let query = 'UPDATE users SET';

		Object.keys(fields).map((key, index, array) => {

			if ((index + 1) < array.length) {
				query = `${query}
					${key} = '${fields[key]}',
				`;

			} else {
				query = `${query}
					${key} = '${fields[key]}'
					WHERE id = ${id}
				`;
			}
		});

		await db.query(query);

		return;
	},
	find(id) {
		return db.query(`
			SELECT *
			FROM users
			WHERE id = $1
		`, [id]);
	},
	findAll() {
		return db.query('SELECT * FROM users');
	},
	async updateToUsers(data) {
		const query = `
			UPDATE users SET
				name=($1),
				is_admin=($2)
			WHERE id = $3
		`;

		const values = [
			data.name,
			data.is_admin,
			data.id
		];

		return await db.query(query, values);
	},
	delete(id) {
		return db.query('DELETE FROM users WHERE id = $1', [id]);
	},
};
