'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Categories', [
      {
        category_name: 'Drinks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        category_name: 'Foods',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Categories', null, {});
  },
};
