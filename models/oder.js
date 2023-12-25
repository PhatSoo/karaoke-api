'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      room_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      time_using: DataTypes.FLOAT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
      timestamps: true,
    }
  );

  Order.associate = (models) => {
    Order.hasMany(models.OrderDetail, { foreignKey: 'order_id' });
  };
  return Order;
};
