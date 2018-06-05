// downloading of output results
const json2xls = require('json2xls');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const getReport = (request, response) => {
  const payload = { report_id: parseInt(request.params.id),
                    user_id: request.decoded.id
                  }
    db.reportDB.get(payload, (error, queryResults) => {
    db.reportResultsDB.getOutput(queryResults.query, (error2, queryResults2) => {
      if (error2) {
        response.render('report/report', { user: request.decoded,
                                           metadata: queryResults,
                                           error: true, 
                                           errorMessage : error2 })
      } else {
        response.render('report/report', { user: request.decoded,
                                           metadata: queryResults, 
                                           data: queryResults2.rows })
      }
    })
  })
}


const editReport = (request, response) => {
  const payload = { report_id: parseInt(request.params.id),
                    user_id: request.decoded.id
                  }
  db.reportDB.get(payload, (error, queryResults) => {
    response.render('report/edit', Object.assign({ user: request.decoded }, queryResults));
  })
}


const edit = (request, response) => {
  db.reportDB.edit(request.body, (error, queryResults) => {
    response.send('done');
  })
}


const newReport = (request, response) => {
  db.reportDB.getCategory((error, queryResults) => {
    response.render('report/new', { user: request.decoded,
                                    category: queryResults });
  });
}


const createReport = (request, response) => {
  db.reportDB.createReport(Object.assign(request.body, {id: request.decoded.id}), (error, queryResults) => {
    response.send(queryResults);
  });
}


const remove = (request, response) => {
  db.reportDB.remove(request.params.id, (error, queryResults) => {
    response.send(queryResults);
  });
}


const downloadReport = (request, response) => {
  const payload = { report_id: parseInt(request.params.id),
                    user_id: request.decoded.id
                  }
  db.reportDB.get(payload, (error, queryResults) => {
    db.reportResultsDB.getOutput(queryResults.query, (error2, queryResults2) => {
      if (error2) {
        response.render('report/report', { user: request.decoded,
                                           metadata: queryResults,
                                           error: true, 
                                           errorMessage : error2 })
      } else {
        const xls = json2xls(queryResults2.rows);
        const fileName = queryResults.title.replace(/\s/g, '-') + '.xlsx';
        const filePath = path.join(__dirname, '..', 'public', 'exports', fileName);
        fs.writeFileSync(filePath, xls, 'binary');
        response.download(filePath, fileName, (err) => {
          if (err) {
            console.error(err);
          } else {
            fs.unlinkSync(filePath);
          }
        });
      }
    })
  })
}


const favourite = (request, response) => {
  const payload = { report_id: parseInt(request.params.id),
                    user_id: request.decoded.id,
                    rating: parseInt(request.body.rating)
                  }
  db.reportDB.favourite(payload, (error) => {
    if (error) {
      console.error(error);
    } else {
      response.send('done');
    }
  })
}

const preview = (request, response) => {
  db.reportResultsDB.getOutput(request.body.query, (error, queryResults) => {
    if (error) {
      response.send({ error: true, 
                      errorMessage : error.message
                    })
    } else {
      response.send({ error: false, 
                      data: queryResults.rows
                    })
    }
  })
}

const notifyAuthor = (request, response) => {
  db.userDB.getAuthorEmail(request.params.id, (error, queryResults) => {
    const transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: process.env.DEFAULT_EMAIL,
        pass: process.env.DEFAULT_PASSWORD
      }
    }));

    const mailOptions = {
      subject: `Query Me | Report Error`,
      to: queryResults.email,
      from: `QueryMe <${process.env.DEFAULT_EMAIL}>`,
      html: `
        <p>Hi there,</p>
        <p>An error has been reported by ${request.decoded.name} regarding the following report: </p>
        <p>Report: <a>http://${request.headers.host}/reports/${request.params.id}</a></p>
        <p>Error: ${request.body.error}</p>
        <p>You might want to look into it whenever possible.</p>
      `
    }

    transporter.sendMail(mailOptions, (error2, response2) => {
      if (error2) {
        // can't send out email
        console.error(error2);
      } else {
        response.send('done');
      }
    }) 
  })
}

module.exports = {
  getReport,
  editReport,
  edit,
  newReport,
  createReport,
  remove,
  downloadReport,
  favourite,
  preview,
  notifyAuthor
}