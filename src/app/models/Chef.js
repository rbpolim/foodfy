const db = require('../../config/db');

module.exports = {
	all() {
		return db.query(`
			SELECT chefs.*, count(recipes) AS total_recipes
			FROM chefs
			LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
			GROUP BY chefs.id
			ORDER BY chefs.id ASC
		`);
	},
	create(data, fileId) {
		const query = `
			INSERT INTO chefs (
				name,
				file_id
			) VALUES ($1, $2)
			RETURNING id
		`;

		const values = [
			data.name,
			fileId,
		];

		return db.query(query, values);
	},
	find(id) {
		return db.query(`
		SELECT chefs.*, count(recipes) AS total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		WHERE chefs.id = $1
		GROUP BY chefs.id
		ORDER BY total_recipes DESC
		`, [id]);
	},
	update(data, fileId) {
		const query = `
			UPDATE chefs SET
				name=($1),
				file_id=($2)
			WHERE id = $3
		`;

		const values = [
			data.name,
			fileId,
			data.id
		];

		return db.query(query, values);
	},
	delete(id) {
		return db.query('DELETE FROM chefs WHERE id = $1', [id]);
	},
	countRecipe(id) {
		return db.query(`
			SELECT recipes.*, count(recipes) AS total_recipes
			FROM chefs
			LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
			WHERE chefs.id = $1
			GROUP BY recipes.id
			ORDER BY total_recipes DESC
		`, [id]);
	},
};
