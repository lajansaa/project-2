module.exports = (dbPool) => {
  return {
    get: (report_id, callback) => {
      const queryString = `SELECT * FROM reports WHERE id = ${report_id};`
      dbPool.query(queryString, (err, res) => {
        callback(err, res.rows[0]);
      })
    },

    getOutput: (queryString, callback) => {
      dbPool.query(queryString, (err, res) => {
        callback(err, res.rows);
      })
    }

  }
}