const Recipe = require('../models/Recipe');
const File = require('../models/File');

module.exports = {
  async index(req, res) {
    let results = await Recipe.all();
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

    return res.render('admin/recipes/index', { recipes, lastAdded });
  },
  async create(req, res) {
    let results = await Recipe.chefsSelectOptions();
    const options = results.rows;

    return res.render('admin/recipes/create', { chefOptions: options });
  },
  async post(req, res) {
    try {
      if (req.files.length == 0) {
        return res.render('admin/recipes/create', {
          error: 'A receita precisa ter no mínimo uma foto.',
        });
      }

      req.body.user_id = req.session.userId;

      let results = await Recipe.create(req.body);
      const recipeId = results.rows[0].id;

      const filesPromise = req.files.map(file => File.create(file));
      const filesResults = await Promise.all(filesPromise);

      const recipeFilesPromise = filesResults.map(file => {
        const fileId = file.rows[0].id;

        File.createAtRecipeFiles(fileId, recipeId);
      });

      await Promise.all(recipeFilesPromise);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      console.error(err);
    }
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

    return res.render('admin/recipes/show', { recipe, files });
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    results = await Recipe.chefsSelectOptions();
    const chefOptions = results.rows;

    results = await File.findFilesRecipe(req.params.id);
    let files = results.rows;
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
    }));

    return res.render('admin/recipes/edit', { recipe, chefOptions, files });
  },
  async put(req, res) {
    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(newfile => File.create(newfile));
      const filesResults = await Promise.all(newFilesPromise);

      const newRecipeFilesPromise = filesResults.map(newRecipeFile => {
        const fileId = newRecipeFile.rows[0].id;

        File.createAtRecipeFiles(fileId, req.body.id);
      });

      await Promise.all(newRecipeFilesPromise);
    }

    if (req.body.removed_files) {
      // 1,2,3,
      const removedFiles = req.body.removed_files.split(','); // [1,2,3,]
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1); // [1,2,3]

      const removedFilesPromise = removedFiles.map(id => File.delete(id));

      await Promise.all(removedFilesPromise);
    }

    await Recipe.update(req.body);

    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id);

    return res.redirect('/admin/recipes');
  },
};
