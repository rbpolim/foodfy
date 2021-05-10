const express = require('express');

const clients = require('../app/controller/ClientsController');

const routes = express.Router();

// === CLIENTS ROUTES === //
routes.get('/', clients.index);
routes.get('/search', clients.index);
routes.get('/about', clients.about);
routes.get('/recipes', clients.recipes);
routes.get('/recipes/:id', clients.show);
routes.get('/chefs', clients.chefs);

module.exports = routes;
