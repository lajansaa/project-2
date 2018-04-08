const db = require('../db');

const newForm = (request, response) => {
  response.render('user/new');
}

const create = (request, response) => {
  db.userDB.create(request.body, (error, queryResults) => {
    if (queryResults.duplicate == true) {
      response.render('error/duplicate-user');
    } else {
      // response.cookie('token', queryResults.token);
      response.redirect('../../admin');
    }
  })
}

const loginForm = (request, response) => {
  response.render('user/login', { user: request.decoded } );
}

const login = (request, response) => {
  db.userDB.login(request.body, (error, queryResults) => {
    if (queryResults.invalidCredentials == true) {
      response.render('error/invalid-credentials');
    } else if (queryResults.userNotFound == true) {
      response.render('error/user-not-found');
    } else {
      response.cookie('token', queryResults.token);
      response.redirect('/categories');
    }
  })
}

const logout = (request, response) => {
  response.clearCookie('token');
  response.render('user/logout');
}

const favourite = (request, response) => {
  db.userDB.getFavourite(request.decoded.id, (error, queryResults) => {
    response.render('user/favourite', Object.assign({ user: request.decoded }, queryResults));
  })
}

const remove = (request, response) => {
  db.userDB.remove(request.params.id, (error, queryResults) => {
    response.redirect('../../admin');
  })
}

const edit = (request, response) => {
  db.userDB.edit(Object.assign(request.body, {id: request.params.id}), (error, queryResults) => {
    response.redirect('../../admin');
  })
}

module.exports = {
  newForm,
  create,
  loginForm,
  login,
  logout,
  favourite,
  remove,
  edit
}