const db = require('../db');

const newForm = (request, response) => {
  response.render('user/new');
}

const create = (request, response) => {
  db.userDB.create(request.body, (error, queryResults) => {
    if (queryResults.duplicate == false) {
      response.cookie('token', queryResults.token);
    }
    response.redirect('/categories');
  })
}

const loginForm = (request, response) => {
  response.render('user/login', { user: request.decoded } );
}

const login = (request, response) => {
  db.userDB.login(request.body, (error, queryResults) => {
    if (queryResults == false) {
      response.render('error/invalid-credentials');
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

module.exports = {
  newForm,
  create,
  loginForm,
  login,
  logout
}