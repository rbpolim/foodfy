const User = require('../models/User');
const mailer = require('../../lib/mailer');

module.exports = {
	registerForm(req, res) {
		return res.render('admin/users/register');
	},
	async list(req, res) {
		const logged = req.session.userId;

		const results = await User.findAll();
		const users = results.rows;

		return res.render('admin/users/index', { users, logged });
	},
	async post(req, res) {
		try {
			const results = await User.create(req.body);

			const userPassword = results.password;

			await mailer.sendMail({
				to: req.body.email,
				from: 'no-replay@foodfy.com.br',
				subject: 'Cadastre-se no Foodfy',
				html: `
					<h2>Olá, ${req.body.name}.</h2>

					<h3>Seja bem-vindo(a) ao Foodfy, seu cadastro foi realizado com sucesso!</h3>

					<h4>Confira abaixo as suas informações de acesso:</h4>
					<p><strong>E-mail:</strong> ${req.body.email}</p>
					<p><strong>Senha:</strong> ${userPassword}</p>
					<p><a href="http://localhost:3000/admin/login" target="_blank">Fazer Login</a></p>
				`,
			});

			return res.render('admin/users/register', {
				success: 'Seu cadastro foi realizado com sucesso! Uma senha de acesso foi enviado para o seu e-mail.'
			});

		} catch (err) {
			console.error(err);

			return res.render('admin/users/register', {
				error: 'Erro inesperado. Tente novamente!'
			});
		}
	},
	async update(req, res) {
		const { user } = req;
		const { name } = req.body;

		try {
			await User.update(user.id, {
				name,
			});

			return res.render('admin/users/show', {
				user: req.body,
				success: 'A sua conta foi atualizada com sucesso.'
			});
		} catch (err) {
			console.error(err);

			return res.render('admin/users/show', {
				user: req.body,
				error: 'Desculpe. Algum erro aconteceu!'
			});
		}
	},
	async show(req, res) {
		let { id } = req.params;

		const user = await User.findOne({
			where: { id },
		});

		if (!user) {
			return res.redirect('/admin/users', {
				error: 'Usuário não encontrado.',
			});
		}

		return res.render('admin/users/edit', { user });
	},
	async updateToUsers(req, res) {
		const { user } = req;

		try {
			await User.updateToUsers(req.body);

			return res.redirect(`/admin/users/${user.id}`);
		} catch (err) {
			console.error(err);

			return res.render('admin/users/edit', {
				user: req.body,
				error: 'Desculpe. Algum erro aconteceu!'
			});
		}
	},
	async delete(req, res) {
		await User.delete(req.body.id);

		return res.redirect('/admin/users');
	},
};
