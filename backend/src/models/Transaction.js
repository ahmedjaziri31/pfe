const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      field: "user_id",
    },
    walletId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Wallets",
        key: "id",
      },
      field: "wallet_id",
    },
    autoInvestPlanId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "auto_invest_plans",
        key: "id",
      },
      field: "auto_invest_plan_id",
    },
    type: {
      type: DataTypes.ENUM(
        "deposit",
        "withdrawal",
        "reward",
        "investment",
        "rent_payout",
        "referral_bonus",
        "autoinvest_failed"
      ),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.ENUM("USD", "EUR", "TND"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed", "failed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: true, // External transaction reference
    },
    balanceType: {
      type: DataTypes.ENUM("cash", "rewards"),
      allowNull: false,
      field: "balance_type",
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true, // Additional transaction data
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "processed_at",
    },
    // Blockchain integration fields
    blockchainHash: {
      type: DataTypes.STRING(66),
      allowNull: true,
      field: "blockchain_hash",
      comment: "Blockchain transaction hash"
    },
    blockNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "block_number",
      comment: "Block number where transaction was mined"
    },
    gasUsed: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "gas_used",
      comment: "Gas used for blockchain transaction"
    },
    blockchainStatus: {
      type: DataTypes.ENUM("pending", "confirmed", "failed"),
      allowNull: true,
      field: "blockchain_status",
      comment: "Blockchain transaction status"
    },
    contractAddress: {
      type: DataTypes.STRING(42),
      allowNull: true,
      field: "contract_address",
      comment: "Smart contract address if applicable"
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["wallet_id"],
      },
      {
        fields: ["type"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["created_at"],
      },
    ],
  }
);

module.exports = Transaction;
