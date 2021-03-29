const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
	async index(req, res) {
		let results = await Chef.all();
		const chefs = results.rows;

		//FUNÇÃO RESPONSÁVEL POR PEGAR APENAS A 1ª IMG
		async function getImage(fileId) {
			let results = await File.fileChef(fileId);
			const files = results.rows.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

			return files[0];
		}

		//COLOCANDO A IMG[0] DENTRO DO CHEF
		const chefsPromise = chefs.map(async chef => {
			chef.img = await getImage(chef.id);

			return chef;
		});

		const lastAdded = await Promise.all(chefsPromise);

		return res.render('admin/chefs/index', { chefs, lastAdded });

	},
	create(req, res) {
		return res.render('admin/chefs/create');
	},
	async post(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (key of keys) {
				if (req.body[key] == '') {
					return res.render('admin/chefs/create', {
						error: 'Preencha todos os campos disponíveis.'
					});
				}
			}

			if (!req.file) {
				return res.render('admin/chefs/create', {
					error: 'Por favor, envie pelo menos uma foto.'
				});
			}

			let results = await File.create({ ...req.file });
			const fileId = results.rows[0].id;

			results = await Chef.create(req.body, fileId);
			const chefId = results.rows[0].id;

			return res.redirect(`/admin/chefs/${chefId}`);
		} catch (err) {
			console.error(err);
		}
	},
	async show(req, res) {
		let results = await Chef.countRecipe(req.params.id);
		const recipes = results.rows;

		async function getImage(fileId) {
			let results = await File.findFilesRecipe(fileId);

			const files = results.rows.map(file =>
				`${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
			);

			return files[0];
		}

		const recipePromise = recipes.map(async recipe => {
			recipe.img = await getImage(recipe.id);

			return recipe;
		});

		const lastAdded = await Promise.all(recipePromise);

		results = await Chef.find(req.params.id);
		const chef = results.rows[0];

		if (!chef) {
			return res.render('admin/chefs/index', {
				chef: req.body,
				error: 'Chef não encontrado.',
			});
		}

		results = await File.fileChef(req.params.id);
		let files = results.rows;
		files = files.map(file => ({
			...file,
			src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`,
		}));

		return res.render('admin/chefs/show', {
			recipes: lastAdded,
			chef,
			files
		});
	},
	async edit(req, res) {
		let results = await Chef.find(req.params.id);
		const chef = results.rows[0];

		if (!chef) {
			return res.render('admin/chefs', {
				error: 'Chef não encontrado.'
			});
		}

		results = await File.fileChef(req.params.id);
		const avatar = results.rows[0];

		return res.render('admin/chefs/edit', { chef, avatar });

	},
	async put(req, res) {
		try {
			const keys = Object.keys(req.body);

			for (key of keys) {
				if (req.body[key] == '') {
					return res.send('Please, fill all fields');
				}
			}

			let fileId = req.body.old_file_id;

			if (req.file) {

				let results = await File.create({ ...req.file });
				fileId = results.rows[0].id;

				await Chef.update(req.body, fileId);

				await File.delete(req.body.old_file_id);

				return res.redirect(`/admin/chefs/${req.body.id}`);

			} else {

				await Chef.update(req.body, fileId);

			}

			return res.redirect(`/admin/chefs/${req.body.id}`);

		}
		catch (err) {
			console.error(err);
		}
	},
	async delete(req, res) {
		const result = await Chef.find(req.body.id);
		const chef = result.rows[0];

		await Chef.delete(req.body.id);
		await File.deleteAvatarChefs(chef.file_id);

		return res.redirect('/admin/chefs');
	},
};
