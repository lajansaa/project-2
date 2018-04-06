const db = require('../db');

const getCategories = (request, response) => {
  db.categoryDB.getCategories((error, queryResult) => {
    response.render('category/category', { category: queryResult });
  })
}

const getCategoryReports = (request, response) => {
  db.categoryDB.getCategoryReports(request.params.id, (error, queryResult) => {
    response.render('category/category_report', { category_report: queryResult });
  })
}

module.exports = {
  getCategories,
  getCategoryReports
}