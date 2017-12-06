const data = require('./data.js');

module.exports = {
  getData: (req, res) => {
    const min = req.query.min;
    const max = req.query.max;
    if (min || max) {
      const filteredData = data.filter(item => {
        const startTime = new Date(item.start_time);
        if (startTime >= new Date(min) && startTime <= new Date(max)) {
          return item;
        }
      });
      res.json(filteredData);
    } else {
      res.json(data);
    }
  }
};