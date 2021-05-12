const User = require('../models/User');

function onlyUsers(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/admin/login');
  }

  next();
}

async function isAdmin(req, res, next) {
  try {
    const id = req.session.userId;

    let result = await User.find(id);
    const user = result.rows[0];

    if (user.is_admin === false) {
      return res.redirect('/admin/users');
    }

    next();
  } catch (err) {
    console.error(err)

    return res.redirect('/admin/users', {
      error: 'Erro. Tente novamente.',
    });
  }
}

module.exports = {
  onlyUsers,
  isAdmin,
};
