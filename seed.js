const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const File = require('./src/app/models/File');

const totalUsers = 3;
const totalChefs = 8;
const totalFiles = 8;

let usersIds = [];
let chefsIds = [];
let filesIds = [];

async function createUser() {
  const users = [];
  const password = await hash('123456', 8);

  while (users.length < totalUsers) {
    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      is_admin: faker.random.boolean(),
    })
  }

  const usersPromisse = users.map(user => User.create(user));

  usersIds = await Promise.all(usersPromisse);
}

async function createChef() {
  let files = [];
  let chefs = [];

  while (files.length < 8) {
    files.push({
      name: faker.image.image(),
      path: `public/images/placeholder.png`,
    })
  }

  const filesPromise = files.map(file => File.create(file));

  filesIds = await Promise.all(filesPromise);

  while (chefs.length < 8) {
    chefs.push({
      name: faker.name.firstName(),
      file_id: Math.ceil(Math.random() * 8),
    })
  }

  const chefsPromise = chefs.map(chef => Chef.create(chef));

  chefsIds = await Promise.all(chefsPromise);
}

async function init() {
  await createUser();
  await createChef();
}

init();
