const db = require('../db');

const getControlPanel = (request, response) => {
  db.adminDB.getUsers({ user_id: request.decoded.id,
                        approved: true
                      }, (error, queryResults) => {
    response.render('admin/control-panel', { user: request.decoded,
                                             users: queryResults.users,
                                             numReq: queryResults.numReq
                                           });
  })
}

const getRequests = (request, response) => {
  db.adminDB.getUsers({ user_id: request.decoded.id,
                        approved: false
                      }, (error, queryResults) => {
    response.render('admin/requests', { user: request.decoded,
                                        users: queryResults.users,
                                        numReq: queryResults.numReq
                                      });
  })
}

module.exports = {
  getControlPanel,
  getRequests
}