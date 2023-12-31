const { Product, Category, OrderDetail, Order } = require('../models');
const { Op } = require('sequelize');

const list = async (req, res) => {
  try {
    const listProduct = await Product.findAll({
      include: {
        model: Category,
        attributes: ['category_name', 'id'],
      },
      order: ['id'],
      paranoid: false,
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

const create = async (req, res) => {
  const { product_name, price, category_id, image, unit, quantity } = req.body;

  if (!product_name || !price || !category_id || !unit || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existProduct = await Product.findOne({ where: { product_name } });
    if (existProduct) {
      return res.status(403).json({ success: false, message: 'Product name is existed' });
    }

    const createProduct = await Product.create({ product_name, price, category_id, image, unit, quantity });
    if (createProduct) {
      return res.status(200).json({ success: true, message: 'Create product successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ success: false, message: error });
  }
};

const update = async (req, res) => {
  const { id, product_name, price, category_id, image, quantity, unit } = req.body;

  if (!product_name || !price || !category_id || !quantity || !unit || !image) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existProduct = await Product.findOne({ where: { id } });
    if (!existProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateProduct = await Product.update({ product_name, price, category_id, image, quantity, unit }, { where: { id } });
    if (updateProduct) {
      return res.status(200).json({ success: true, message: 'Update product successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ success: false, message: error });
  }
};

const checkInUse = async (product_id) => {
  return OrderDetail.findAll({ where: { product_id }, include: [{ model: Order, where: { status: 'NOT PAID' } }] });
};

const remove = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existProduct = await Product.findOne({ where: { id } });
    if (!existProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const r = await checkInUse(id);

    if (r.length > 0) {
      return res.status(500).json({ success: false, message: 'Sản phẩm đang trong quá trình chờ thanh toán' });
    }

    const deleteProduct = await Product.destroy({ where: { id } });
    if (deleteProduct) {
      return res.status(200).json({ success: true, message: 'Delete product successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const delete_multiple = async (req, res) => {
  let { ids } = req.params;

  ids = ids.split(',').map(Number);

  if (!ids) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    await Promise.all(
      ids.map(async (id) => {
        const r = await checkInUse(id);
        if (r.length > 0) {
          throw new Error('Có sản phẩm đang trong quá trình chờ thanh toán');
        }
      })
    );

    const deleteMultiple = await Product.destroy({ where: { id: ids } });

    if (deleteMultiple) {
      return res.status(200).json({ success: true, message: 'Delete products successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const detail = async (req, res) => {
  const { product_name } = req.params;

  if (!product_name) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const product = await Product.findOne({ where: { product_name } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  list,
  create,
  update,
  remove,
  detail,
  delete_multiple,
};
