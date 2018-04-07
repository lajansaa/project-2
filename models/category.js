module.exports = (dbPool) => {
  return {
    getCategories: (callback) => {
      const queryString = `SELECT * FROM categories ORDER BY 1;`;
      dbPool.query(queryString, (err, res) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, res.rows);
        }
      })
    },

    getCategoryReports: (category_id, callback) => {
      const queryString = `SELECT id, title FROM reports WHERE category_id = '${category_id}' ORDER BY 1;`;
      dbPool.query(queryString, (err, res) => {
        callback(err, res.rows);
      })
    }
  }
}