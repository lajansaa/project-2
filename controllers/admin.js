const db = require('../db');

const getControlPanel = (request, response) => {
  response.render('admin/control-panel')
}

module.exports = {
  getControlPanel
}