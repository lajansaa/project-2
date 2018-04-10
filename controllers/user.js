const db = require('../db');
var crypto = require('crypto');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const newForm = (request, response) => {
  response.render('user/new');
}

const create = (request, response) => {
  db.userDB.create(request.body, (error, queryResults) => {
    if (queryResults.duplicate == true) {
      response.render('error/duplicate-user');
    } else {
      // response.cookie('token', queryResults.token);
      response.redirect('../../admin');
    }
  })
}

const loginForm = (request, response) => {
  response.render('user/login', { user: request.decoded } );
}

const login = (request, response) => {
  db.userDB.login(request.body, (error, queryResults) => {
    if (queryResults.invalidCredentials == true) {
      response.render('error/invalid-credentials');
    } else if (queryResults.userNotFound == true) {
      response.render('error/user-not-found');
    } else {
      response.cookie('token', queryResults.token);
      response.redirect('/categories');
    }
  })
}

const logout = (request, response) => {
  response.clearCookie('token');
  response.render('user/logout');
}

const favourite = (request, response) => {
  db.userDB.getFavourite(request.decoded.id, (error, queryResults) => {
    response.render('user/favourite', Object.assign({ user: request.decoded }, queryResults));
  })
}

const remove = (request, response) => {
  db.userDB.remove(request.params.id, (error, queryResults) => {
    response.redirect('../../admin');
  })
}

const edit = (request, response) => {
  db.userDB.edit(Object.assign(request.body, {id: request.params.id}), (error, queryResults) => {
    response.redirect('../../admin');
  })
}

const forgotPasswordForm = (request, response) => {
  response.render('user/forgot-password');
}

const forgotPassword = (request, response) => {
  db.userDB.findUser(request.body.email, (error, queryResults) => {
    if (queryResults.found == true) {
      crypto.randomBytes(20, (error2, buffer) => {
        const passwordResetKey = buffer.toString('hex');
        const passwordKeyExpires = new Date().getTime() + 24 * 60 * 60 * 1000;
        db.userDB.setTempPassword({ id: queryResults.user_id,
                                    reset_password_token: passwordResetKey,
                                    reset_password_expires: passwordKeyExpires
                                  }, (error3, queryResults3) => {

          const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
              user: process.env.DEFAULT_EMAIL,
              pass: process.env.DEFAULT_PASSWORD
            }
          }));

          const mailOptions = {
            subject: `Query Me | Password Reset`,
            to: request.body.email,
            from: `QueryMe <${process.env.DEFAULT_EMAIL}>`,
            html: `
              <p>Hi there,</p>
              <p>You recently requested for a password change. Please click on the following link to reset your password:</p>
              <a>http://${request.headers.host}/users/reset/${passwordResetKey}</a>
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
          }

          transporter.sendMail(mailOptions, (error4, response4) => {
            if (error3) {
              // can't send out email
              console.error(error4);
            } else {
              response.redirect('./forgot-password');
            }
          })                            
        })
      })
    } else {
      // can't find user email
      response.redirect('./forgot-password')
    }
  })
}

const resetForm = (request, response) => {
  response.render('user/reset-form')
}

const reset = (request, response) => {
  db.userDB.reset({ password: request.body.password,
                    reset_password_token: request.params.token }, (error, queryResults) => {
    response.send(queryResults);
  })
}

module.exports = {
  newForm,
  create,
  loginForm,
  login,
  logout,
  favourite,
  remove,
  edit,
  forgotPasswordForm,
  forgotPassword,
  resetForm,
  reset
}