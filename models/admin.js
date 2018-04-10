module.exports = (dbPool) => {
  return {
    getUsers: (payload, callback) => {
      const queryString = `SELECT
                               id,
                               INITCAP(name) AS name,
                               email,
                               role 
                           FROM users
                           WHERE id != ${payload.user_id}
                             AND approved = ${payload.approved}
                           ORDER BY 2;`;
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, { users: results.rows,
                          numReq: results.rowCount
                        });
        }
      })
    }
  }
}