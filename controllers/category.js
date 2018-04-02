const getCategories = (db) => {
  return (request, response) => {
    db.categoryDB.getCategories((error, queryResult) => {
      response.render('category/category', { category: queryResult });
    })
  }
}

const getCategoryReports = (db) => {
  return (request, response) => {
    db.categoryDB.getCategoryReports(request.params.id, (error, queryResult) => {
      response.render('category/category_report', { category_report: queryResult });
    })
  }
}

module.exports = {
  getCategories,
  getCategoryReports
}