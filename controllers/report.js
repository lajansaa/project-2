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

module.exports = {
  getReport
}