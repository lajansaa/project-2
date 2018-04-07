const db = require('../db');

const getControlPanel = (request, response) => {
  response.render('admin/control-panel', { user: request.decoded } );
}

module.exports = {
  getControlPanel
}