const data = require('./data.js')

module.exports = {
  getData: (req, res) => {
    res.json(data);
  }
};