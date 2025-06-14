const reports = require('../models/reportModel');

const getReports = (req, res) => {
  res.json(reports);
};

module.exports = {
  getReports,
};