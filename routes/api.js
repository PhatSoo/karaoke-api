const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const checkAdmin = require('../middlewares/isAdmin');

const UserController = require('../controllers/UserController');
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');
const RoomController = require('../controllers/RoomController');

const APIRoute = (app) => {
  router.get('/user', checkAdmin, UserController.listAll);
  router.post('/user', checkAdmin, UserController.create);

  router.get('/product/:product_name', checkAdmin, ProductController.detail);
  router.get('/product', checkAdmin, ProductController.list);
  router.post('/product', checkAdmin, ProductController.create);
  router.put('/product/:id', checkAdmin, ProductController.update);
  router.put('/product/:id', checkAdmin, ProductController.remove);

  router.get('/order/:id', OrderController.orderDetail);
  router.get('/order', OrderController.list);
  router.post('/order', OrderController.create);
  router.post('/order-product', OrderController.orderProduct);
  router.put('/payment', OrderController.payment);

  router.get('/room', RoomController.list);

  return app.use('/api/', authenticate, router);
};

module.exports = { APIRoute };
