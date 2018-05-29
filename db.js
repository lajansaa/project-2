const pg = require('pg');
const category = require('./models/category');
const report = require('./models/report');
const reportResults = require('./models/report');
const user = require('./models/user');
const admin = require('./models/admin');
let dbConfigs, queryConfigs;

if (process.env.NODE_ENV == 'production') {
  dbConfigs = {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  };
  queryConfigs = {
    connectionString: process.env.HEROKU_POSTGRESQL_COBALT_URL,
    ssl: true
  };
} else {
  dbConfigs = {
    user: process.env.METADATA_DB_USER,
    host: process.env.METADATA_DB_HOST,
    database: process.env.METADATA_DB_DATABASE,
    port: process.env.METADATA_DB_PORT
  };
  queryConfigs = {
    user: process.env.QUERY_DB_USER,
    host: process.env.QUERY_DB_HOST,
    database: process.env.QUERY_DB_DATABASE,
    port: process.env.QUERY_DB_PORT
  };
}

const dbPool = new pg.Pool(dbConfigs);
const queryPool = new pg.Pool(queryConfigs);


dbPool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

queryPool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

module.exports = {
  categoryDB: category(dbPool),
  reportDB: report(dbPool),
  reportResultsDB: reportResults(queryPool),
  userDB: user(dbPool),
  adminDB: admin(dbPool)
}


