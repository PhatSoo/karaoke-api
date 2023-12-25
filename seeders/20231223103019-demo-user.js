'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: '$2a$10$dVgqNswzGiR69jsFejpF9u7NdzZ3Z8wniATDky2hN/Bxzc1fFT/7a',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user',
        password: '$2a$10$68lwGIY9/Vg9hTpeIHUsCO/Av7hlzcfCnVt5e5DSwbkdkRSgKQv7.',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user2',
        password: '$2a$10$68lwGIY9/Vg9hTpeIHUsCO/Av7hlzcfCnVt5e5DSwbkdkRSgKQv7.',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user3',
        password: '$2a$10$68lwGIY9/Vg9hTpeIHUsCO/Av7hlzcfCnVt5e5DSwbkdkRSgKQv7.',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('Users', null, {});
  },
};
