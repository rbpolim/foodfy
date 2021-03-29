const db = require('../../config/db');

module.exports = {
  all() {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY created_at DESC
    `);
  },
  find(id, callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`, [id], function (err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows[0]);
    });
  },
  findBy(filter) {
    return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.title ILIKE '%${filter}%'
      ORDER BY created_at DESC
    `);
  },
  paginate(params) {
    const { filter, limit, offset } = params;

    let query = '',
      filterQuery = '',
      totalQuery = `(
        SELECT count(*) FROM recipes
      ) AS total`;

    if (filter) {
      filterQuery = `
        WHERE recipes.recipename ILIKE '%${filter}%'
      `;

      totalQuery = `(
        SELECT count(*) FROM recipes
        ${filterQuery}
      ) AS total`;
    }

    query = `
      SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ${filterQuery}
      LIMIT $1 OFFSET $2
    `;

    return db.query(query, [limit, offset]);
  },
};
