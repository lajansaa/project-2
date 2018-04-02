const categories = require('./controllers/category');

module.exports = (app, db) => {
  app.get('/categories', categories.get(db));
}

