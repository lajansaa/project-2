const getReport = (db) => {
  return (request, response) => {
    db.reportDB.get(request.params.id, (error, queryResults) => {
      db.reportDB.getOutput(queryResults.query, (error2, queryResults2) => {
        response.render('report/report', { metadata: queryResults, 
                                           data: queryResults2 })
        
      })
    })
  }
}

const editReport = (db) => {
  return (request, response) => {
    db.reportDB.get(request.params.id, (error, queryResults) => {
      response.render('report/edit', queryResults);
    })
  }
}

const edit = (db) => {
  return (request, response) => {
    db.reportDB.edit(request.body, (error, queryResults) => {
      response.send('done');
    })
  }
}

module.exports = {
  getReport,
  editReport,
  edit
}