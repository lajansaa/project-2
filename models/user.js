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
               callback(err2, results2);
             }
          })
        }
      })
    }

  }
}