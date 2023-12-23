const { Product } = require('../models');

const list = async (req, res) => {
  try {
    const listProduct = await Product.findAll();
    if (listProduct) {
      return res.status(200).json({ success: true, data: listProduct, total: listProduct.length });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong!' });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: error });
  }
};

const create = async (req, res) => {
  const { product_name, price, category_id, image } = req.body;

  if (!product_name || !price || !category_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existProduct = await Product.findOne({ where: { product_name } });
    if (existProduct) {
      return res.status(403).json({ success: false, message: 'Product name is existed' });
    }

    const createProduct = await Product.create({ product_name, price, category_id, image });
    if (createProduct) {
      return res.status(200).json({ success: true, message: 'Create product successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { product_name, price, category_id, image } = req.body;

  if (!product_name || !price || !category_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existProduct = await Product.findOne({ where: { id } });
    if (!existProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updateProduct = await Product.update({ product_name, price, category_id, image }, { where: { id } });
    if (updateProduct) {
      return res.status(200).json({ success: true, message: 'Update product successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
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

    const deleteProduct = await Product.destroy({ where: { id } });
    if (deleteProduct) {
      return res.status(200).json({ success: true, message: 'Delete product successfully' });
    }
    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
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
};
