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
        // Lấy thông tin sản phẩm
        const product = await Product.findOne({ where: { id: order.product_id } });

        // Kiểm tra số lượng sản phẩm tồn kho
        if (product.quantity < order.quantity) {
          return res.status(400).json({ success: false, message: 'Không đủ hàng trong kho' });
        }

        // Cập nhật số lượng sản phẩm tồn kho
        await Product.update({ quantity: product.quantity - order.quantity }, { where: { id: order.product_id } });

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

      // Lấy thông tin sản phẩm
      const product = await Product.findOne({ where: { id: item.product_id } });

      // Kiểm tra số lượng sản phẩm tồn kho
      if (product.quantity < item.quantity) {
        return res.status(400).json({ success: false, message: 'Không đủ hàng trong kho' });
      }

      // Cập nhật số lượng sản phẩm tồn kho
      await Product.update({ quantity: product.quantity - item.quantity }, { where: { id: item.product_id } });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    return res.status(500).json({ success: false, message: error });
  }
};

const getOrderDetailsByRoomID = async (req, res) => {
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

      let transformedOrderDetails;

      if (orderDetails.length > 0) {
        transformedOrderDetails = orderDetails.map((detail) => ({
          id: detail.id,
          product_id: detail.product_id,
          quantity: detail.quantity,
        }));
      } else {
        transformedOrderDetails = [];
      }

      result = {
        id: order.id,
        room_id: order.room_id,
        user_id: order.user_id,
        time_using: order.time_using,
        status: order.status,
        item: transformedOrderDetails,
        createdAt: order.createdAt,
      };

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
  const { order_id, total } = req.body;

  if (!order_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters' });
  }

  try {
    const existingOrder = await Order.findOne({ where: { id: order_id } });

    let countTimeUsing = Math.ceil(new Date() - new Date('2023-12-30 22:07:43.359+07')) / 3600000;

    if (existingOrder) {
      const updatedOrder = await existingOrder.update({ status: 'PAID', time_using: countTimeUsing, total });
      if (updatedOrder) {
        await Room.update({ status: 'NULL' }, { where: { id: existingOrder.room_id } });
      }

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
  getOrderDetailsByRoomID,
};
