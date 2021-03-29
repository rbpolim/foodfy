const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: '9461b124b117b5',
		pass: 'f1d8fe67955310',
	}
});

module.exports = transport;

