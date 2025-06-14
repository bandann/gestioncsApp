const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Rutas para reportes
router.get('/', reportController.getReports);

module.exports = router;