const express = require('express');
const multer = require('../app/middlewares/multer');

const routes = express.Router();

const chefs = require('../app/controller/ChefsController');

const { isAdmin, onlyUsers } = require('../app/middlewares/session');

//admin/chefs'

// === CHEFS ROUTES === //
routes.get('/', onlyUsers, chefs.index);
routes.get('/create', isAdmin, chefs.create);
routes.get('/:id', onlyUsers, chefs.show);
routes.get('/:id/edit', isAdmin, chefs.edit);

routes.post('/', isAdmin, multer.single('photos'), chefs.post);
routes.put('/', isAdmin, multer.single('photos'), chefs.put);
routes.delete('/', isAdmin, chefs.delete);

module.exports = routes;
