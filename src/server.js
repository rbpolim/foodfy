const express = require('express');
const nunjucks = require('nunjucks');
const routes = require('./routes');
const session = require('./config/session');

const port = 5000;

const methodOverride = require('method-override');

const server = express();

server.use(session);
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

server.set('view engine', 'njk');

nunjucks.configure('src/app/views', {
	express: server,
	noCache: true
});

server.listen(process.env.port || port, function () {
	console.log('🚀 server is running');
});
