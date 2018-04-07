const db = require('../db');

const getCategories = (request, response) => {
  db.categoryDB.getCategories((error, queryResult) => {
    response.render('category/category', { user: request.decoded,
                                           category: queryResult });
  })
}

const getCategoryReports = (request, response) => {
  db.categoryDB.getCategoryReports(request.params.id, (error, queryResult) => {
    response.render('category/category_report', { user: request.decoded,
                                                  category_report: queryResult });
  })
}

module.exports = {
  getCategories,
  getCategoryReports
}