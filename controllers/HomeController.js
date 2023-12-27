const { User, Product, Category } = require('../models');
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

const listProduct = async (req, res) => {
  try {
    const listProduct = await Product.findAll({
      include: {
        model: Category,
        attributes: ['category_name', 'id'],
      },
      order: ['id'],
    });
    if (listProduct) {
      const listProductFormatted = listProduct.map((product) => {
        const { Category, ...rest } = product.toJSON();
        return {
          ...rest,
          category_id: {
            id: Category.id,
            category_name: Category.category_name,
          },
        };
      });
      return res.status(200).json({ success: true, data: listProductFormatted, total: listProductFormatted.length });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong!' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: error });
  }
};

module.exports = { login, listProduct };
