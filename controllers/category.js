const get = (db) => {
  return (request, response) => {
    db.categoryDB.get((error, queryResult) => {
      response.render('category/category', { category: queryResult });
    })
  }
}

module.exports = {
  get
}