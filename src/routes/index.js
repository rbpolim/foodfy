const express = require('express');

const routes = express.Router();

const clients = require('./clients');
const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');

routes.use('/', clients);
routes.use('/admin/recipes', recipes);
routes.use('/admin/chefs', chefs);
routes.use('/admin', users);

module.exports = routes;
