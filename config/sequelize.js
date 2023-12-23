const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connect PostgreSQL successfully');
  })
  .catch((err) => {
    console.error('Connect failed:', err);
  });

module.exports = sequelize;
