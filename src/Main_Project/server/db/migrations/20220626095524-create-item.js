'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      item_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      item_name: {
        type: Sequelize.STRING
      },
      item_type: {
        type: Sequelize.STRING
      },
      item_message: {
        type: Sequelize.STRING
      },
      pokemon_id: {
        type: Sequelize.STRING
      },
      pokemon_name: {
        type: Sequelize.STRING
      },
      pokemon_type:{
        type: Sequelize.STRING
      },
      pokemon_image: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  }
};