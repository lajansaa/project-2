// modules
const express = require('express');
const handlebars = require('express-handlebars');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

// other internal js files
const db = require('./db');

// init express app
const app = express();

// set handlebars as view engine
const handlebarsConfig = {
  extname: '.handlebars',
  layoutsDir: 'views',
  defaultLayout: 'main',
  helpers: {
    tabulate: (data) => {
      let str = '<table class="ui striped celled table">';
      
      str += '<thead><tr>';
      for (let key in data[0]) {
        str += '<th>' + key + '</th>';
      }
      str += '</tr></thead><tbody>';

      for (let i = 0; i < data.length; i++ ) {
        str += '<tr>';
        for (let key in data[i]) {
          str += '<td>' + data[i][key] + '</td>';
        };
        str += '</tr>';
      };
      str += '</tbody></table>';
      return str;
    },
    equate: (x, y) => {
      if (x == y) {
        return true;
      } else {
        return false;
      }
    },
    not: (bool) => {
      if (bool == true) {
        return false;
      } else {
        return true;
      }
    }
  }
}
app.engine('.handlebars', handlebars(handlebarsConfig));
app.set('view engine', '.handlebars');

// set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.all('*', authenticateUser);

function authenticateUser(request, response, next) {
  let _ = require('underscore')
  let ignorePaths = ['/', '/users/new', '/users/login', '/users/logout', '/users/forgot-password'];
  if ( _.contains(ignorePaths, request.path) || request.path.substring(0,12) == '/users/reset') {
    return next(); 
  } else {
    let token = request.cookies["token"];
    if (!token) {
      response.render('error/not-authorised');
    } else {
      jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {
        if (err) {
          response.render('error/not-authorised');
        } else {
          request.decoded = decoded;
          next();
        }
      });
    }
  }
}

// home page
app.get('/', (request, response) => {
  response.redirect('/categories');
})

// import routes
require('./routes')(app);

// listen on port 3000
const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000 ~~~'));
