const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (dbPool) => {
  return {
    create: (user, callback) => {
      console.log(user);
      const checkDuplicate = `SELECT * FROM users WHERE email = '${user.email}';`
      dbPool.query(checkDuplicate, (err, results) => {
        if (results.rowCount > 0) {
          callback(err, { duplicate: true });
        } else {
          bcrypt.hash(user.password, 1, (err2, hashedPassword) => {
            const queryString = `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${hashedPassword}') RETURNING name, role;`;
            dbPool.query(queryString, (err3, results3) => {
              if (err3) {
                console.error(err3);
              } else {
                callback(err3, { duplicate: false});
              }
            })
          })
        }
      })
    },

    login: (user, callback) => {
      const queryString = `SELECT id, name, password, role FROM users WHERE email='${user.email}' AND approved;`;
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
        const updateString = `UPDATE users SET name='${user.name}', email='${user.email}', password='${hashedPassword}', role='${user.role}', approved=true WHERE id = ${user.id};`;
        dbPool.query(updateString, (err, results) => {
          if (err) {
              console.error(err);
          } else {
            callback(err, results);
          }
        })
      })
    },

    findUser: (email, callback) => {
      const queryString = `SELECT id, email FROM users WHERE email='${email}';`;
      dbPool.query(queryString, (err, results) => {
        if (results.rowCount == 0) {
          callback(err, { found: false })
        } else {
          callback(err, { found: true, user_id: results.rows[0].id })
        }
      })
    },

    setTempPassword: (payload, callback) => {
      const updateString = `UPDATE users SET reset_password_token='${payload.reset_password_token}', reset_password_expires='${payload.reset_password_expires}' WHERE id=${payload.id};`;
      dbPool.query(updateString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results);
        }
      })
    },

    reset: (payload, callback) => {
      const now = new Date().getTime();
      const queryString = `SELECT
                               id
                           FROM users
                           WHERE reset_password_token = '${payload.reset_password_token}'
                             AND ${now} < reset_password_expires;`
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else if (results.rowCount == 0) {
          callback(err, { invalidToken: true });
        } else {
          bcrypt.hash(payload.password, 1, (err2, hashedPassword) => {
            const updateString = `UPDATE users SET password='${hashedPassword}' WHERE id=${results.rows[0].id};`
            dbPool.query(updateString, (err3, results3) => {
              if (err3) {
                console.error(err3);
              } else {
                const setNullString = `UPDATE users SET reset_password_token=NULL, reset_password_expires=NULL WHERE id=${results.rows[0].id};`
                dbPool.query(setNullString, (err4, results4) => {
                  if (err4) {
                    console.error(err4);
                  } else {
                    callback(err3, { updateSuccess: true })
                  }
                })
              }
            })
          })
        }
      })                             
    },

    getAuthorEmail: (report_id, callback) => {
      const queryString = `SELECT
                               U.email
                           FROM reports R
                           JOIN users U ON R.user_id = U.id
                           WHERE R.id = ${report_id};`
      dbPool.query(queryString, (err, results) => {
        if (err) {
          console.error(err);
        } else {
          callback(err, results.rows[0]);
        }
      })
    }

  }
}