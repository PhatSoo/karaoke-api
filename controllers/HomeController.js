const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(500).json({ success: false, message: 'Missing required params' });
  }

  try {
    const findUser = await User.findOne({ where: { username } });
    if (findUser) {
      const unHash = await bcrypt.compare(password, findUser.password);

      if (unHash) {
        const token = jwt.sign({ id: findUser.id, isAdmin: findUser.role === 'ADMIN' }, process.env.JWT_PASS, { expiresIn: '1h' });
        return res.status(200).json({ success: true, token });
      }
    }

    return res.status(200).json({ success: false, message: 'Thông tin đăng nhập chưa chính xác.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = { login };
