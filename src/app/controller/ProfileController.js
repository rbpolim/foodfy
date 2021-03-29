const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const { hash } = require('bcryptjs');

const User = require('../models/User');

module.exports = {
	async show(req, res) {
		const { user } = req;

		if (!user) {
			return res.render('admin/users/edit', {
				user: req.body,
				error: 'Usuário não cadastrado'
			});
		}

		return res.render('admin/users/show', { user });
	},
	logout(req, res) {
		req.session.destroy();

		return res.redirect('/');
	},
	loginForm(req, res) {
		return res.render('session/login');
	},
	async login(req, res) {
		try {
			const { id } = req.user;

			req.session.userId = id;

			return res.redirect('/admin/profile');
		} catch (err) {
			console.error(err);

			return res.render('session/login', {
				error: 'Erro inesperado. Tente novamente!',
			});
		}
	},
	forgotForm(req, res) {
		return res.render('session/forgot-password');
	},
	async forgot(req, res) {
		try {
			const user = req.user;

			const token = crypto.randomBytes(20).toString('hex');

			let now = new Date();
			now = now.setHours(now.getHours() + 1);

			await User.update(user.id, {
				reset_token: token,
				reset_token_expires: now,
			});

			await mailer.sendMail({
				to: user.email,
				from: 'no-reply@foofdy.com.br',
				subject: 'Recuperação de Senha',
				html: `<h2>Perdeu a chave?</h2>
          <p>Não se preocupe, click no link para recuperar a sua senha.</p>
          <p>
              <a href="http://localhost:3000/admin/reset-password?token=${token}" target="_blank">
                RECUPERAR SENHA
              </a>
              <a>${token}</a>
          </p>
        `,
			});

			return res.render('session/forgot-password', {
				success: 'Verifique o seu e-mail para recuperar a sua senha.',
			});
		} catch (err) {
			console.error(err);

			return res.render('session/forgot-password', {
				error: 'Erro inesperado, tente novamente.'
			});
		}
	},
	resetForm(req, res) {
		return res.render('session/reset-password', {
			token: req.query.token,
		});
	},
	async reset(req, res) {
		const user = req.user;
		const { password, token } = req.body;

		try {
			const newPassword = await hash(password, 8);

			await User.update(user.id, {
				password: newPassword,
				reset_token: '',
				reset_token_expires: '',
			});

			return res.render('session/login', {
				user: req.body,
				success: 'Senha atualizada com sucesso. Faça seu login.'
			});
		} catch (err) {
			console.error(err);

			return res.render('session/reset-password', {
				user: req.body,
				token,
				error: 'Erro inesperado. Tente novamente.'
			});
		}
	},
};
