const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (dbPool) => {
  return {
    create: (user, callback) => {
      const checkDuplicate = `SELECT * FROM users WHERE email = '${user.email}';`
      dbPool.query(checkDuplicate, (err, results) => {
        if (results.rowCount > 0) {
          callback(err, { duplicate: true });
        } else {
          bcrypt.hash(user.password, 1, (err2, hashedPassword) => {
            const queryString = `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${hashedPassword}') RETURNING name, role;`;
            dbPool.query(queryString, (err3, results3) => {
              let token = jwt.sign({ id: results3.rows[0].id,
                                     name: results3.rows[0].name,
                                     role: results3.rows[0].role,
                                     loggedIn: true },
                                   process.env.TOKEN_KEY,
                                   { expiresIn: 86400 }
                                  );
              callback(err3, { duplicate: false,
                               loggedIn: true,
                               token: token
                             });
            })
          })
        }
      })
    },

    login: (user, callback) => {
      const queryString = `SELECT id, name, password, role FROM users WHERE email='${user.email}';`;
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          if (results.rowCount == 0) {
            callback(err, {userNotFound: true});
          } else {
            bcrypt.compare(user.password, results.rows[0].password, (err2, results2) => {
              if (results2 == true) {
                let payload = {
                  id: results.rows[0].id,
                  name: results.rows[0].name,
                  role: results.rows[0].role,
                  loggedIn: true
                }
                let token = jwt.sign(payload, process.env.TOKEN_KEY)
                callback(err2, { token: token });
              } else {
                callback(err2, {invalidCredentials: true});
              }
            })
          }
        } 
      })
    },

    getFavourite: (user_id, callback) => {
      const queryString = `SELECT
                               F.report_id,
                               R.title
                           FROM favourites F
                           JOIN reports R ON F.report_id = R.id
                           WHERE F.user_id='${user_id}';`;
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, { count: results.rowCount,
                          results: results.rows
                        });
        }
      })
    },

    remove: (user_id, callback) => {
      const deleteString = `DELETE from users WHERE id = ${user_id};`;
      dbPool.query(deleteString, (err, results) => {
        if (err) {
            console.error(err);
        } else {
          const deleteFavString = `DELETE FROM favourites WHERE user_id = ${user_id};`;
          dbPool.query(deleteFavString, (err2, results2) => {
            if (err2) {
              console.error(err2);
            } else {
              callback(err2, results2);
            }
          })
        }
      })
    },

    edit: (user, callback) => {
      bcrypt.hash(user.password, 1, (err2, hashedPassword) => {
        const updateString = `UPDATE users SET name='${user.name}', email='${user.email}', password='${hashedPassword}', role='${user.role}' WHERE id = ${user.id};`;
        dbPool.query(updateString, (err, results) => {
          if (err) {
              console.error(err);
          } else {
            callback(err, results);
          }
        })
      })
    }

  }
}