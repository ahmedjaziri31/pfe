"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Check if transactions table exists
      const tables = await queryInterface.showAllTables();
      
      if (tables.includes('transactions')) {
        // Add blockchain-related columns to transactions table
        await queryInterface.addColumn('transactions', 'blockchain_hash', {
          type: Sequelize.STRING(66),
          allowNull: true,
          comment: 'Blockchain transaction hash'
        }, { transaction });

        await queryInterface.addColumn('transactions', 'block_number', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Block number where transaction was mined'
        }, { transaction });

        await queryInterface.addColumn('transactions', 'gas_used', {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'Gas used for blockchain transaction'
        }, { transaction });

        await queryInterface.addColumn('transactions', 'blockchain_status', {
          type: Sequelize.ENUM('pending', 'confirmed', 'failed'),
          allowNull: true,
          comment: 'Blockchain transaction status'
        }, { transaction });

        await queryInterface.addColumn('transactions', 'contract_address', {
          type: Sequelize.STRING(42),
          allowNull: true,
          comment: 'Smart contract address if applicable'
        }, { transaction });

        // Add indexes for better performance
        await queryInterface.addIndex('transactions', ['blockchain_hash'], {
          name: 'transactions_blockchain_hash_idx',
          unique: true,
          where: {
            blockchain_hash: {
              [Sequelize.Op.ne]: null
            }
          }
        }, { transaction });

        await queryInterface.addIndex('transactions', ['blockchain_status'], {
          name: 'transactions_blockchain_status_idx'
        }, { transaction });

        console.log('✅ Blockchain fields added to transactions table');
      }

      // Also add blockchain fields to wallet_transactions table if it exists
      if (tables.includes('wallet_transactions')) {
        await queryInterface.addColumn('wallet_transactions', 'blockchain_hash', {
          type: Sequelize.STRING(66),
          allowNull: true,
          comment: 'Blockchain transaction hash'
        }, { transaction });

        await queryInterface.addColumn('wallet_transactions', 'block_number', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Block number where transaction was mined'
        }, { transaction });

        await queryInterface.addColumn('wallet_transactions', 'blockchain_status', {
          type: Sequelize.ENUM('pending', 'confirmed', 'failed'),
          allowNull: true,
          comment: 'Blockchain transaction status'
        }, { transaction });

        console.log('✅ Blockchain fields added to wallet_transactions table');
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove blockchain fields from transactions table
      await queryInterface.removeColumn('transactions', 'blockchain_hash', { transaction });
      await queryInterface.removeColumn('transactions', 'block_number', { transaction });
      await queryInterface.removeColumn('transactions', 'gas_used', { transaction });
      await queryInterface.removeColumn('transactions', 'blockchain_status', { transaction });
      await queryInterface.removeColumn('transactions', 'contract_address', { transaction });

      // Remove blockchain fields from wallet_transactions table
      await queryInterface.removeColumn('wallet_transactions', 'blockchain_hash', { transaction });
      await queryInterface.removeColumn('wallet_transactions', 'block_number', { transaction });
      await queryInterface.removeColumn('wallet_transactions', 'blockchain_status', { transaction });

      await transaction.commit();
      console.log('✅ Blockchain fields removed from tables');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }
}; 