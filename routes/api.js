const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const checkAdmin = require('../middlewares/isAdmin');

const UserController = require('../controllers/UserController');
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');
const RoomController = require('../controllers/RoomController');
const CategoryController = require('../controllers/CategoryController');

const APIRoute = (app) => {
  router.get('/employee', UserController.listAll);
  router.post('/user', checkAdmin, UserController.create);

  router.get('/product/:product_name', checkAdmin, ProductController.detail);
  router.get('/product', ProductController.list);
  router.post('/product', checkAdmin, ProductController.create);
  router.put('/product', checkAdmin, ProductController.update);
  router.delete('/product/:id', checkAdmin, ProductController.remove);
  router.delete('/product-multiple/:ids', checkAdmin, ProductController.delete_multiple);

  router.get('/order/:id', OrderController.orderDetail);
  router.get('/get-order-details/:room_id', OrderController.getOrderDetailsByRoomID);
  router.get('/order', OrderController.list);
  router.post('/order', OrderController.create);
  router.post('/order-product', OrderController.orderProduct);
  router.put('/payment', OrderController.payment);

  router.get('/room', RoomController.list);

  router.get('/category', CategoryController.list);

  return app.use('/api/', authenticate, router);
};

module.exports = { APIRoute };
