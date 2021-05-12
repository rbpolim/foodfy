const express = require('express');

const multer = require('../app/middlewares/multer');
const recipes = require('../app/controller/RecipesController');
const { onlyUsers } = require('../app/middlewares/session');

const routes = express.Router();

// === RECIPES ROUTES === //
routes.get('/', recipes.index);
routes.get('/create', onlyUsers, recipes.create);
routes.get('/:id', recipes.show);
routes.get('/:id/edit', onlyUsers, recipes.edit);

routes.post('/', onlyUsers, multer.array('photos', 5), recipes.post);
routes.put('/', multer.array('photos', 5), recipes.put);
routes.delete('/', onlyUsers, recipes.delete);

module.exports = routes;
