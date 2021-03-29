const express = require('express');

const routes = express.Router();

const clients = require('../app/controller/ClientsController');

routes.get('/', clients.index);
routes.get('/about', clients.about);
routes.get('/recipes', clients.recipes);
routes.get('/recipes/:id', clients.show);
routes.get('/chefs', clients.chefs);

routes.get('/search', clients.index);

module.exports = routes;
