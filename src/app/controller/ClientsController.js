/* eslint-disable no-inner-declarations */
const Client = require('../models/Client');
const File = require('../models/File');
const Recipe = require('../models/Recipe');
const Chef = require('../models/Chef');

module.exports = {
	async index(req, res) {
		const { filter } = req.query;

		if (filter) {
			let results = await Client.findBy(filter);

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

			return res.render('clients/search', { recipes, filter });
		}

		let results = await Client.all();
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

		return res.render('clients/index', { recipes: lastAdded });
	},
	about(req, res) {
		res.render('clients/about');
	},
	async recipes(req, res) {
		let { filter, page, limit } = req.query;

		page = page || 1;
		limit = limit || 3;
		let offset = limit * (page - 1);

		const results = await Recipe.all();
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

		const params = {
			filter,
			limit,
			offset,
		};

		await Client.paginate(params);

		// const pagination = {
		// 	total: Math.ceil(recipes[0].total / limit),
		// 	page
		// }

		return res.render('clients/recipes', { recipes, lastAdded, filter });
	},
	async show(req, res) {
		let results = await Recipe.find(req.params.id);
		const recipe = results.rows[0];

		if (!recipe) {
			return res.send('Recipe not found');
		}

		results = await File.findFilesRecipe(req.params.id);
		let files = results.rows;
		files = files.map(file => ({
			...file,
			src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
		}));

		return res.render('clients/show', { recipe, files });
	},
	async chefs(req, res) {
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

		return res.render('clients/chefs', { chefs, lastAdded });
	},
};
