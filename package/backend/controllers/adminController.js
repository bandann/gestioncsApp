const users = require('../models/userModel');
const admins = require('../models/adminModel');

const getAdmins = (req, res) => {
  res.json(admins);
};

const createAdmin = (req, res) => {
  const newAdmin = { id: admins.length + 1, ...req.body };
  admins.push(newAdmin);
  res.status(201).json(newAdmin);
};

const updateAdmin = (req, res) => {
  const adminIndex = admins.findIndex((admin) => admin.id === parseInt(req.params.id));
  if (adminIndex === -1) {
    return res.status(404).json({ message: 'Administrador no encontrado' });
  }
  admins[adminIndex] = { ...admins[adminIndex], ...req.body };
  res.json(admins[adminIndex]);
};

const deleteAdmin = (req, res) => {
  const adminIndex = admins.findIndex((admin) => admin.id === parseInt(req.params.id));
  if (adminIndex === -1) {
    return res.status(404).json({ message: 'Administrador no encontrado' });
  }
  const deletedAdmin = admins.splice(adminIndex, 1);
  res.json(deletedAdmin);
};

const getAdminsAndUsers = (req, res) => {
  res.json({ admins, users });
};

module.exports = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminsAndUsers,
};