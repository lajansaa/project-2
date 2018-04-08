const db = require('../db');

const getControlPanel = (request, response) => {
  db.adminDB.getUsers(request.decoded.id, (error, queryResults) => {
    response.render('admin/control-panel', { user: request.decoded,
                                             allUsers: queryResults
                                           });
  })
}

module.exports = {
  getControlPanel
}