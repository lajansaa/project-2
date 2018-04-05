const categories = require('./controllers/category');
const reports = require('./controllers/report');

module.exports = (app, db) => {
  app.get('/categories/:id', categories.getCategoryReports(db)),
  app.get('/categories', categories.getCategories(db)),

  app.post('/reports/:id/download', reports.downloadReport(db)),
  app.get('/reports/new', reports.newReport(db)),
  app.post('/reports/new', reports.createReport(db)),
  app.delete('/reports/:id/delete', reports.remove(db)),
  app.get('/reports/:id', reports.getReport(db)),
  app.get('/reports/:id/edit', reports.editReport(db)),
  app.put('/reports/:id/edit', reports.edit(db))
}

