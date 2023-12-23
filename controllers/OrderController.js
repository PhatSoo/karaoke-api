const { Order, OrderDetail, Product } = require('../models');

const list = async (req, res) => {
  try {
    const listOrder = await Order.findAll();

    if (listOrder) {
      return res.status(200).json({ success: true, data: listOrder, total: listOrder.length });
    }

    return res.status(404).json({ success: false, message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const create = async (req, res) => {
  const { room_id, user_id } = req.body;

  try {
    const createOrder = Order.create({ room_id, user_id, status: 'NOT PAID' });

    if (createOrder) {
      return res.status(404).json({ success: true, message: 'Create order successfully' });
    }

    return res.status(404).json({ success: false, message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const orderProduct = async (req, res) => {
  const { order_id, order } = req.body;

  try {
    const orderDetails = order.map((item) => ({
      order_id,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const createOrderDetail = await OrderDetail.bulkCreate(orderDetails);

    if (createOrderDetail) {
      return res.status(200).json({ success: true, message: 'Order products successfully' });
    }

    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const orderDetail = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const orderDetails = await OrderDetail.findAll({
      where: { order_id: id },
      include: {
        model: Product,
        attributes: ['product_name', 'price', 'image'],
      },
    });

    if (!orderDetails) {
      return res.status(404).json({ success: false, message: 'Order details not found' });
    }

    return res.status(200).json({ success: true, orderDetails });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

const payment = async (req, res) => {
  const { order_id } = req.body;

  if (!order_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existingOrder = await Order.findOne({ where: { order_id } });

    if (existingOrder) {
      await existingOrder.update({ status: 'PAID' });

      return res.status(200).json({ success: true, message: 'Payment success' });
    }

    return res.status(404).json({ success: false, message: 'Order details not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

module.exports = {
  list,
  create,
  orderProduct,
  orderDetail,
  payment,
};
