const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Rutas para notificaciones
router.get('/', notificationController.getNotifications);
router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;