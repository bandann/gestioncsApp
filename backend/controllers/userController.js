const users = require('../models/userModel');

const getUsers = (req, res) => {
  res.json(users);
};

const createUser = (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
};

const updateUser = (req, res) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
};

const deleteUser = (req, res) => {
  const userIndex = users.findIndex((user) => user.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }
  const deletedUser = users.splice(userIndex, 1);
  res.json(deletedUser);
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};