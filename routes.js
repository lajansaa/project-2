const categories = require('./controllers/category');

module.exports = (app, db) => {
  app.get('/categories/:id', categories.getCategoryReports(db)),
  app.get('/categories', categories.getCategories(db))
}

