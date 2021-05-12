const express = require('express');

const multer = require('../app/middlewares/multer');
const chefs = require('../app/controller/ChefsController');
const { isAdmin, onlyUsers } = require('../app/middlewares/session');

const routes = express.Router();

// === CHEFS ROUTES === //
routes.get('/', onlyUsers, chefs.index);
routes.get('/create', isAdmin, chefs.create);
routes.get('/:id', onlyUsers, chefs.show);
routes.get('/:id/edit', isAdmin, chefs.edit);

routes.post('/', isAdmin, multer.single('photos'), chefs.post);
routes.put('/', isAdmin, multer.single('photos'), chefs.put);
routes.delete('/', isAdmin, chefs.delete);

module.exports = routes;
