module.exports = (dbPool) => {
  return {
    getUsers: (user_id, callback) => {
      const queryString = `SELECT id, INITCAP(name) AS name, role FROM users WHERE id != ${user_id} ORDER BY 2;`;
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results.rows);
        }
      })
    }
  }
}