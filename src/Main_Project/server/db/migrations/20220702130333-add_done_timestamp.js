'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('items', 'item_done_timestamp', {
      allowNull: true,
      type: Sequelize.DATE,
      defaultValue: null
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('items', 'item_done_timestamp');
  }
};