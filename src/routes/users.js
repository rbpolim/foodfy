const express = require('express');

const UserController = require('../app/controller/UserController');
const ProfileController = require('../app/controller/ProfileController');
const UserValidator = require('../app/validators/user');
const SessionValidator = require('../app/validators/session');

const { isAdmin, onlyUsers } = require('../app/middlewares/session');

const routes = express.Router();

// === RECIPES ROUTES === //
routes.get('/users', onlyUsers, UserController.list);

routes.get('/users/:id', isAdmin, UserController.show);
routes.put('/users', UserValidator.updateToUsers, UserController.updateToUsers);
routes.delete('/users', isAdmin, UserController.delete);

routes.get('/register', isAdmin, UserController.registerForm);
routes.post('/register', isAdmin, UserValidator.post, UserController.post);

routes.get('/profile', onlyUsers, UserValidator.show, ProfileController.show);
routes.put('/profile', UserValidator.update, UserController.update);

routes.post('/logout', onlyUsers, ProfileController.logout);

routes.get('/login', ProfileController.loginForm);
routes.post('/login', SessionValidator.login, ProfileController.login);

routes.get('/forgot-password', ProfileController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, ProfileController.forgot);

routes.get('/reset-password', ProfileController.resetForm);
routes.post('/reset-password', SessionValidator.reset, ProfileController.reset);

module.exports = routes;
