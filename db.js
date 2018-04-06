const pg = require('pg');
const category = require('./models/category');
const report = require('./models/report');

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
  reportDB: report(pool)
}


