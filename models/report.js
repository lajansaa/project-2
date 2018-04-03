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
    },

    edit: (report, callback) => {
      const queryString = `UPDATE reports SET title=$$${report.title}$$, description=$$${report.description}$$, query=$$${report.query}$$ WHERE id=${report.id};`
      dbPool.query(queryString, (err, res) => {
        callback(err, res);
      })
    }

  }
}