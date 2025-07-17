'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      surname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      account_type: {
        type: Sequelize.STRING(50),
        defaultValue: "Individual Account"
      },
      korpor_since: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      investment_used_pct: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      investment_total: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      global_users: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      global_countries: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      currency: {
        type: Sequelize.ENUM("TND", "EUR"),
        defaultValue: "TND"
      },
      investment_preference: {
        type: Sequelize.JSON,
        defaultValue: '"all"'
      },
      investment_region: {
        type: Sequelize.JSON,
        defaultValue: '"Tunisia"'
      },
      referral_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true
      },
      referred_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      referral_stats: {
        type: Sequelize.JSON,
        defaultValue: '{"totalReferred":0,"totalInvested":0,"totalEarned":0}'
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      approval_status: {
        type: Sequelize.ENUM("unverified", "pending", "approved", "rejected"),
        defaultValue: "unverified"
      },
      profile_picture: {
        type: Sequelize.STRING(255),
        defaultValue: ""
      },
      cloudinary_public_id: {
        type: Sequelize.STRING(255),
        defaultValue: ""
      },
      failed_login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      locked_until: {
        type: Sequelize.DATE,
        allowNull: true
      },
      last_login: {
        type: Sequelize.DATE,
        allowNull: true
      },
      refresh_token: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      refresh_token_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
}; 