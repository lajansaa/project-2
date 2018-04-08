const categories = require('./controllers/category');
const reports = require('./controllers/report');
const users = require('./controllers/user');
const admins = require('./controllers/admin');

module.exports = (app) => {
  app.get('/categories/:id', categories.getCategoryReports),
  app.get('/categories', categories.getCategories),

  app.post('/reports/:id/download', reports.downloadReport),
  app.get('/reports/new', reports.newReport),
  app.post('/reports/new', reports.createReport),
  app.delete('/reports/:id/delete', reports.remove),
  app.get('/reports/:id', reports.getReport),
  app.post('/reports/:id/preview', reports.preview),
  app.get('/reports/:id/edit', reports.editReport),
  app.put('/reports/:id/edit', reports.edit),
  app.put('/reports/:id/favourite', reports.favourite),

  app.get('/users/new', users.newForm),
  app.post('/users/new', users.create),
  app.post('/users/login', users.login),
  app.post('/users/logout', users.logout),
  app.get('/users/login', users.loginForm),
  app.get('/users/favourite', users.favourite),
  app.delete('/users/:id/delete', users.remove),
  app.put('/users/:id/edit', users.edit),

  app.get('/admin', admins.getControlPanel)
}

