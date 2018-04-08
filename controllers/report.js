// downloading of output results
const json2xls = require('json2xls');
const fs = require('fs');
const db = require('../db');

const getReport = (request, response) => {
  const payload = { report_id: parseInt(request.params.id),
                    user_id: request.decoded.id
                  }
    db.reportDB.get(payload, (error, queryResults) => {
    db.reportDB.getOutput(queryResults.query, (error2, queryResults2) => {
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
  db.reportDB.get(request.params.id, (error, queryResults) => {
    db.reportDB.getOutput(queryResults.query, (error2, queryResults2) => {
      if (error2) {
        response.render('report/report', { user: request.decoded,
                                           metadata: queryResults,
                                           error: true, 
                                           errorMessage : error2 })
      } else {
        const xls = json2xls(queryResults2.rows);
        const fileName = queryResults.title.replace(/\s/g, '-') + '.xlsx';
        fs.writeFileSync('./public/exports/' + fileName, xls, 'binary');
        response.download('./public/exports/' + fileName, fileName, (err) => {
          if (err) {
            console.error(err);
          } else {
            fs.unlinkSync('./public/exports/' + fileName);
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
  db.reportDB.getOutput(request.body.query, (error, queryResults) => {
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


module.exports = {
  getReport,
  editReport,
  edit,
  newReport,
  createReport,
  remove,
  downloadReport,
  favourite,
  preview
}