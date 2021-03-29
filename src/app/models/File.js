const db = require('../../config/db');
const fs = require('fs');

module.exports = {
	create({ filename, path }) {
		const query = `
			INSERT INTO files (
				name,
				path
			) VALUES ($1, $2)
			RETURNING id
		`;

		const values = [
			filename,
			path,
		];

		return db.query(query, values);
	},
	createAtRecipeFiles(fileId, recipeId) {
		const query = `
			INSERT INTO recipe_files (
				recipe_id,
				file_id
			) VALUES ($1, $2)
			RETURNING id
		`;

		const values = [
			recipeId,
			fileId,
		];

		return db.query(query, values);
	},
	chefsSelectOptions() {
		return db.query('SELECT name, id FROM chefs');
	},
	findFilesRecipe(id) {
		return db.query(`
			SELECT recipe_files.*, files.path
			FROM recipe_files
			LEFT JOIN files on (files.id = recipe_files.file_id)
			WHERE recipe_files.recipe_id = $1
		`, [id]);
	},
	async delete(id) {
		try {
			const result = await db.query('SELECT * FROM files WHERE id = $1', [id]);
			const file = result.rows[0];

			fs.unlinkSync(file.path);

			await db.query('DELETE FROM recipe_files WHERE file_id = $1', [id]);

			return db.query('DELETE FROM files WHERE id = $1', [id]);
		} catch (err) {
			console.error(err);
		}
	},
	fileChef(id) {
		return db.query(`
			SELECT chefs.*, files.path
			FROM chefs
			LEFT JOIN files ON (files.id = chefs.file_id)
			WHERE chefs.id = $1
		`, [id]);
	},
	async deleteAvatarChefs(id) {
		try {
			const result = await db.query('SELECT * FROM files WHERE id = $1', [id]);
			const file = result.rows[0];

			fs.unlinkSync(file.path);

			return db.query('DELETE FROM files WHERE id = $1', [id]);
		} catch (err) {
			console.error(err);
		}
	},
};
