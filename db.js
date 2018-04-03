const pg = require('pg');
const category = require('./models/category');
const report = require('./models/report');

const configs = {
  user: 'Isa',
  host: '127.0.0.1',
  database: 'queryme',
  port: 5432
};

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

module.exports = {
  categoryDB: category(pool),
  reportDB: report(pool)
}


