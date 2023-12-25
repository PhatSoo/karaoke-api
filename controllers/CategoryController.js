const { Category } = require('../models');

const list = async (req, res) => {
  try {
    const listCate = await Category.findAll();

    if (listCate) {
      return res.status(200).json({ success: true, data: listCate, total: listCate.length });
    }

    return res.status(404).json({ success: false, message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  list,
};
