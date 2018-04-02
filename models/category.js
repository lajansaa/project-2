module.exports = (dbPool) => {
  return {
    get: (callback) => {
      const queryString = `SELECT * FROM categories ORDER BY 1;`;
      dbPool.query(queryString, (err, res) => {
        callback(err, res.rows);
      })
    }
  }
}