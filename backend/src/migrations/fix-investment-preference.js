'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Drop the existing column first
      await queryInterface.removeColumn('users', 'investment_preference');

      // Create ENUM type
      await queryInterface.sequelize.query(
        'CREATE TYPE enum_users_investment_preference AS ENUM (\'all\', \'local\')'
      ).catch(err => {
        // If error occurs because enum already exists, ignore it
        if (err.original.code !== '42710') throw err;
      });

      // Add the column back as ENUM
      await queryInterface.addColumn('users', 'investment_preference', {
        type: Sequelize.ENUM('all', 'local'),
        allowNull: false,
        defaultValue: 'all'
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Migration Error:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the ENUM column
      await queryInterface.removeColumn('users', 'investment_preference');

      // Drop the ENUM type
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_users_investment_preference'
      );

      // Add back JSON column
      await queryInterface.addColumn('users', 'investment_preference', {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: 'all'
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Migration Error:', error);
      return Promise.reject(error);
    }
  }
}; 