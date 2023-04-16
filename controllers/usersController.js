const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (users === undefined || users.length == 0)
    return res.status(404).json({ message: 'No users found' });
  res.json(users);
};

const createNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: 'Username and password are required.' });

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) {
    return res.status(409).json({ message: `User already exists.` });
  } //Conflict
  try {
    //encrypt the pw
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });
    res.status(201).json({ Success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter required' });
  }

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(404).json({ message: `User ${user._id} not found` });
  }
  try {
    if (req.body.user) user.username = req.body.user;
    if (req.body.roles) user.roles = req.body.roles;
    if (req.body.pwd) {
      const hashedPwd = await bcrypt.hash(req.body.pwd, 10);
      // create and store the new user
      user.password = hashedPwd;
    }
    const updatedUser = await user.save();
    res.status(301).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: 'ID parameter required' });
  }

  const user = await User.findOne({ _id: req.body.id }).exec();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.status(301).json(result);
};

const getUser = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: 'ID parameter required' });
  }
  const user = await User.findOne({ _id: req.params.id }).exec();
  if (!user) {
    return res
      .status(404)
      .json({ message: `User ID ${req.params.id} not found` });
  }
  res.status(200).json(user);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
  getUser,
};
