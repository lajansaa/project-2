const categories = require('./controllers/category');
const reports = require('./controllers/report');

module.exports = (app, db) => {
  app.get('/categories/:id', categories.getCategoryReports(db)),
  app.get('/categories', categories.getCategories(db)),

  app.get('/reports/:id', reports.getReport(db)),
  app.get('/reports/:id/edit', reports.editReport(db)),
  app.put('/reports/:id/edit', reports.edit(db))
}

