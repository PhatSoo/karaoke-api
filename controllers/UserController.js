const { User } = require('../models');
const bcrypt = require('bcrypt');

const listAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ success: true, data: users, total: users.length });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    res.json({ success: false, message: error });
  }
};

const create = async (req, res) => {
  const { username, password, role } = req.body;

  console.log(username, password, role);

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing require parameters' });
  }

  try {
    const existUser = await User.findOne({ where: { username } });
    if (existUser) {
      return res.status(403).json({ success: false, message: 'Username is existed' });
    }

    const hash = await bcrypt.hash(password, 10);

    const createUser = await User.create({ username, password: hash, role });
    if (createUser) {
      return res.status(200).json({ success: true, message: 'Create user successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has been occur' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  listAll,
  create,
};
