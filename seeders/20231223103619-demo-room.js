'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Rooms', [
      {
        room_name: 'Room 1',
        status: 'NULL',
        price: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        room_name: 'Room 2',
        status: 'NULL',
        price: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        room_name: 'Room 3',
        status: 'NULL',
        price: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        room_name: 'Room 4',
        status: 'NULL',
        price: 50000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Rooms', null, {});
  },
};
