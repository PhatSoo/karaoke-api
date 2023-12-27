const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');

const HomeController = require('../controllers/HomeController');

const APPRoute = (app) => {
  router.post('/login', HomeController.login);
  router.get('/product-list', authenticate, HomeController.listProduct);

  return app.use('/', router);
};

module.exports = { APPRoute };
