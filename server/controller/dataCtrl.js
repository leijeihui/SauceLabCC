const data = require('./data.js');

module.exports = {
  getData: (req, res) => {
    let min = req.query.min;
    let max = req.query.max;
    let dp = data.slice();
    if (min || max) {
      dp = dp.filter(item => {
        if (new Date(item.start_time) >= new Date(min) && new Date(item.start_time) <= new Date(max)) {
          return item;
        }
      });
    }
    res.json(dp);
  }
};