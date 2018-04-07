const pg = require('pg');
const category = require('./models/category');
const report = require('./models/report');
const user = require('./models/user');
const admin = require('./models/admin');

const configs = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

module.exports = {
  categoryDB: category(pool),
  reportDB: report(pool),
  userDB: user(pool),
  adminDB: admin(pool)

  // ,
  // singleQuery: async function(queryObj) {
  //   try {
  //     let result = await pool.query(queryObj);
  //     return result.rows;
  //   } catch (error) {
  //     console.error(error.stack);
  //   } finally {
  //     client.release();
  //   }    
  // }
}


