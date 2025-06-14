const notifications = require('../models/notificationModel');

const getNotifications = (req, res) => {
  res.json(notifications);
};

const createNotification = (req, res) => {
  const newNotification = { id: notifications.length + 1, ...req.body };
  notifications.push(newNotification);
  res.status(201).json(newNotification);
};

const updateNotification = (req, res) => {
  const notificationIndex = notifications.findIndex((notification) => notification.id === parseInt(req.params.id));
  if (notificationIndex === -1) {
    return res.status(404).json({ message: 'Notificación no encontrada' });
  }
  notifications[notificationIndex] = { ...notifications[notificationIndex], ...req.body };
  res.json(notifications[notificationIndex]);
};

const deleteNotification = (req, res) => {
  const notificationIndex = notifications.findIndex((notification) => notification.id === parseInt(req.params.id));
  if (notificationIndex === -1) {
    return res.status(404).json({ message: 'Notificación no encontrada' });
  }
  const deletedNotification = notifications.splice(notificationIndex, 1);
  res.json(deletedNotification);
};

module.exports = {
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
};