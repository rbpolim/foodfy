const faker = require('faker');
const { hash } = require('bcryptjs');

const User = require('./src/app/models/User');
const Chef = require('./src/app/models/Chef');
const File = require('./src/app/models/File');

let chefsIds = [];

const totalChefs = 1;

async function createUser() {
  const users = [];

  const password = await hash('123456', 8);

  while (users.length < 2) {
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

async function createChef() {
  const chefs = [];

  const files = createFile(totalChefs, 'chef');
  const filePromise = files.map(file => File.create(file))

  const fileId = await Promise.all(filePromise);


  chefs.push({
    name: faker.name.firstName(),
    fileId,
  });

  const chefPromise = chefs.map(chef => Chef.create(chef))
  await Promise.all(chefPromise)
}

// async function createChef() {
//   const chefs = [];

//   const files = createFile(totalChefs, 'chefs')

//   const chefsFilesPromise = files.map(file => File.create(file))
//   const file_idPromise = chefsFilesPromise.rows.id

//   const chefsFilesIds = await Promise.all(file_idPromise)

//   console.log(chefsFilesIds)

//   for (let fileIndex = 0; chefs.length < totalChefs; fileIndex++) {
//     chefs.push({
//       name: faker.name.firstName(),
//       file_id: chefsFilesIds[fileIndex],
//     })
//   }

  // const chefsPromise = chefs.map(chef => Chef.create(chef))
  // chefsIds = await Promise.all(chefsPromise)
// }

async function init() {
  // await createUser();
  await createChef();
}

init();
