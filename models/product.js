'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      product_name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      price: DataTypes.FLOAT,
      category_id: DataTypes.INTEGER,
      image: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      unit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Product',
      paranoid: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.hasMany(models.OrderDetail, { foreignKey: 'product_id' });
  };

  return Product;
};
