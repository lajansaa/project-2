// modules
const express = require('express');
const handlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// other internal js files
const db = require('./db');

// init express app
const app = express();

// set handlebars as view engine
// const handlebarsConfig = { defaultLayout: 'main' };
const handlebarsConfig = {
  extname: '.handlebars',
  layoutsDir: 'views',
  defaultLayout: 'main'
}
app.engine('.handlebars', handlebars(handlebarsConfig));
app.set('view engine', '.handlebars');

// set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverride('_method'));

// import routes
require('./routes')(app, db);

// home page
app.get('/', (request, response) => {
  const loggedIn = request.cookies["loggedIn"];
  response.render('home', { loggedIn: loggedIn });
})

// Catch all unmatched requests and return 404 not found page
app.get('*', (request, response) => {
  response.render('404');
});

// listen on port 3000
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));

// Run clean up actions when server shuts down
server.on('close', () => {
  console.log('Closed express server');

  db.pool.end(() => {
    console.log('Shut down db connection pool');
  });
});