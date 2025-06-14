const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rutas para administradores
router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.get('/all', adminController.getAdminsAndUsers);

module.exports = router;