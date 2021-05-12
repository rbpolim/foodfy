const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const File = require('./src/app/models/File');
const Recipe = require('./src/app/models/Recipe');

const totalUsers = 3;
const totalChefs = 1;
const totalRecipes = 1;

function createFile(num, placeholder) {
  const files = [];

  while (files.length < num) {
    files.push({
      filename: faker.image.image(),
      path: `public/images/${placeholder}.png`,
    })
  }

  return files;
}

async function createUser() {
  const users = [];
  const password = await hash('123456', 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email().toLowerCase(),
      password,
      is_admin: faker.random.boolean(),
    })
  }

  const usersPromise = users.map(user => User.create(user));
  await Promise.all(usersPromise);
}

async function createChef() {
  const chefs = [];

  const files = createFile(totalChefs, 'chef-dog');
  const filePromise = files.map(file => File.create(file));
  let results = await filePromise[0];
  const file_id = results.rows[0].id;

  chefs.push({
    name: faker.name.firstName(),
    file_id,
  });

  const chefPromise = chefs.map(chef => Chef.create(chef))
  await Promise.all(chefPromise)
}

async function createRecipes() {
  const recipes = [];

  const files = createFile(totalRecipes, 'recipes');
  const filePromise = files.map(file => File.create(file));
  let results = await filePromise[0];
  const file_id = results.rows[0].id;

  recipes.push({
    chef: '1',
    user_id: '1',
    title: faker.commerce.productName(),
    ingredients: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
    preparation: [faker.lorem.sentence(), faker.lorem.sentence(), faker.lorem.sentence()],
    information: faker.lorem.paragraph(3),
  })

  const recipesPromise = recipes.map(recipe => Recipe.create(recipe));
  let recipesResults = await recipesPromise[0];
  const recipe_id = recipesResults.rows[0].id;

  await File.createAtRecipeFiles(file_id, recipe_id)
}

async function init() {
  await createUser();
  await createChef();
  await createRecipes();
}

init();
