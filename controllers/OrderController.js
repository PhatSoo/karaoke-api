const { Order, OrderDetail, Product, Room } = require('../models');

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
  const { room_id, user_id, list_order } = req.body;

  try {
    const createOrder = await Order.create({ room_id, user_id, status: 'NOT PAID' });
    if (createOrder && list_order.length > 0) {
      // Khi order kem sp
      const orderDetails = list_order.map(async (order) => {
        return await OrderDetail.create({
          order_id: createOrder.id,
          product_id: order.product_id,
          quantity: order.quantity,
        });
      });
      await Promise.all(orderDetails);
    }
    if (createOrder) {
      await Room.update({ status: 'IN USE' }, { where: { id: room_id } });
      return res.status(404).json({ success: true, message: 'Create order successfully' });
    }
    return res.status(404).json({ success: false, message: 'Something went wrong' });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ success: false, message: error });
  }
};

const orderProduct = async (req, res) => {
  const { order_id, list_order } = req.body;

  try {
    for (const item of list_order) {
      const existingOrderDetail = await OrderDetail.findOne({
        where: {
          order_id,
          product_id: item.product_id,
        },
      });

      if (existingOrderDetail) {
        // Nếu đã tồn tại, cập nhật quantity
        existingOrderDetail.quantity += parseInt(item.quantity);
        await existingOrderDetail.save();
      } else {
        // Nếu chưa tồn tại, tạo mới
        await OrderDetail.create({
          order_id,
          product_id: item.product_id,
          quantity: item.quantity,
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ success: false, message: error });
  }
};

const getOrderDetails = async (req, res) => {
  const { room_id } = req.params;

  let result = {};

  try {
    const order = await Order.findOne({ where: { room_id, status: 'NOT PAID' } });

    if (order) {
      const order_id = order.id;

      const orderDetails = await OrderDetail.findAll({
        where: { order_id },
        include: {
          model: Order,
        },
      });

      if (orderDetails.length > 0) {
        const transformedOrderDetails = orderDetails.map((detail) => ({
          id: detail.id,
          product_id: detail.product_id,
          quantity: detail.quantity,
        }));

        result = {
          id: orderDetails[0].Order.id,
          room_id: orderDetails[0].Order.room_id,
          user_id: orderDetails[0].Order.user_id,
          time_using: orderDetails[0].Order.time_using,
          status: orderDetails[0].Order.status,
          item: transformedOrderDetails,
          createdAt: orderDetails[0].Order.createdAt,
        };
      } else {
        result = order;
      }

      return res.status(200).json({ success: true, data: result });
    }

    return res.status(500).json({ success: false, message: 'An error has occurred' });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
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
  getOrderDetails,
};
