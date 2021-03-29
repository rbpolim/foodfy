const User = require('../models/User');
const { compare } = require('bcryptjs');

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == '') {
      return res.render('admin/users/register', {
        error: 'Preencha todos os campos disponíveis.'
      });
    }
  }

  let { email } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (user) {
    return res.render('admin/users/register', {
      error: 'Usuário já cadastrado'
    });
  }

  next();
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({
    where: { id }
  });

  if (!user) {
    return res.render('admin/users/register', {
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;

  next();
}

async function update(req, res, next) {
  const { id, password } = req.body;

  console.log(req.body)

  if (!password) {
    return res.render('admin/users/show', {
      user: req.body,
      error: 'Coloque a sua senha para atualizar seu cadastro.',
    });
  }

  const user = await User.findOne({
    where: { id },
  });

  const passed = await compare(password, user.password);

  if (!passed) {
    return res.render('admin/users/show', {
      user: req.body,
      error: 'Senha incorreta.'
    });
  }

  req.user = user;

  next();
}

async function updateToUsers(req, res, next) {
  const { id } = req.body;

  const user = await User.findOne({
    where: { id },
  });

  if (!user) {
    return res.render('admin/users/edit', {
      error: 'Usuário não encontrado.'
    });
  }

  req.user = user;

  next();
}

module.exports = {
  post,
  show,
  update,
  updateToUsers,
};
