const db = require('../../config/db');

module.exports = {
	all() {
		return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY created_at DESC`);
	},
	create(data) {
		const query = `
      INSERT INTO recipes (
        chef_id,
        user_id,
        title,
        ingredients,
        preparation,
        information
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

		const values = [
			data.chef,
			data.user_id,
			data.title,
			data.ingredients,
			data.preparation,
			data.information,
		];

		return db.query(query, values);
	},
	find(id) {
		return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `, [id]);
	},
	update(data) {
		const query = `
      UPDATE recipes SET
        chef_id=($1),
        title=($2),
        ingredients=($3),
        preparation=($4),
        information=($5)
      WHERE id = $6
    `;

		const values = [
			data.chef,
			data.title,
			data.ingredients,
			data.preparation,
			data.information,
			data.id
		];

		return db.query(query, values);
	},
	delete(id) {
		return db.query('DELETE FROM recipes WHERE id = $1', [id]);
	},
	chefsSelectOptions() {
		return db.query('SELECT name, id FROM chefs');
	},
};
