const { User, Wallet, Transaction, sequelize } = require("../models");
const blockchainService = require("../services/blockchain.service");
const { Op } = require("sequelize");

/**
 * Get user wallet with balances
 */
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find or create wallet for user
    let wallet = await Wallet.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "walletUser",
          attributes: ["currency"],
        },
      ],
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      const user = await User.findByPk(userId);
      wallet = await Wallet.create({
        userId,
        currency: user.currency || "TND",
        cashBalance: 0.0,
        rewardsBalance: 0.0,
      });
    }

    // Calculate total balance
    const totalBalance =
      parseFloat(wallet.cashBalance) + parseFloat(wallet.rewardsBalance);

    res.json({
      success: true,
      data: {
        id: wallet.id,
        userId: wallet.userId,
        cashBalance: parseFloat(wallet.cashBalance),
        rewardsBalance: parseFloat(wallet.rewardsBalance),
        totalBalance: totalBalance,
        currency: wallet.currency,
        lastTransactionAt: wallet.lastTransactionAt,
      },
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wallet data",
      error: error.message,
    });
  }
};

/**
 * Get transaction history
 */
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, type, status } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { userId };
    if (type) whereClause.type = type;
    if (status) whereClause.status = status;

    const transactions = await Transaction.findAndCountAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: Wallet,
          as: "wallet",
          attributes: ["id", "currency"],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        transactions: transactions.rows.map((tx) => ({
          id: tx.id,
          type: tx.type,
          amount: parseFloat(tx.amount),
          currency: tx.currency,
          status: tx.status,
          description: tx.description,
          reference: tx.reference,
          balanceType: tx.balanceType,
          metadata: tx.metadata,
          processedAt: tx.processedAt,
          createdAt: tx.created_at,
          // Blockchain information
          blockchainHash: tx.blockchainHash,
          contractAddress: tx.contractAddress,
          blockchainStatus: tx.blockchainStatus,
          blockNumber: tx.blockNumber,
          gasUsed: tx.gasUsed,
        })),
        pagination: {
          total: transactions.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(transactions.count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transaction history",
      error: error.message,
    });
  }
};

/**
 * Add funds to wallet (Deposit)
 */
exports.deposit = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.userId;
    const { amount, description, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get or create wallet
    let wallet = await Wallet.findOne({ where: { userId }, transaction: t });
    if (!wallet) {
      const user = await User.findByPk(userId);
      wallet = await Wallet.create(
        {
          userId,
          currency: user.currency || "TND",
          cashBalance: 0.0,
          rewardsBalance: 0.0,
        },
        { transaction: t }
      );
    }

    // Create transaction record
    const transaction = await Transaction.create(
      {
        userId,
        walletId: wallet.id,
        type: "deposit",
        amount,
        currency: wallet.currency,
        status: "pending", // Will be updated after blockchain confirmation
        description: description || "Cash deposit",
        reference,
        balanceType: "cash",
        blockchainStatus: "pending",
      },
      { transaction: t }
    );

    // Generate blockchain hash for deposit
    try {
      const user = await User.findByPk(userId, { transaction: t });
      const blockchainResult = await blockchainService.generateDepositHash({
        userId,
        amount,
        currency: wallet.currency,
        walletAddress: user.walletAddress || `user_${userId}`,
        paymentMethod: "wallet_deposit",
        transactionId: transaction.id
      });

      // Update transaction with blockchain data
      await transaction.update({
        blockchainHash: blockchainResult.hash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        blockchainStatus: blockchainResult.status,
        contractAddress: blockchainResult.contractAddress,
        status: "completed", // Mark as completed after blockchain confirmation
        processedAt: new Date(),
      }, { transaction: t });

      console.log(`✅ Deposit blockchain hash: ${blockchainResult.hash}`);
    } catch (blockchainError) {
      console.error("⚠️ Blockchain hash generation failed, continuing with deposit:", blockchainError.message);
      // Continue with deposit even if blockchain fails
      await transaction.update({
        status: "completed",
        processedAt: new Date(),
      }, { transaction: t });
    }

    // Update wallet balance
    wallet.cashBalance = parseFloat(wallet.cashBalance) + parseFloat(amount);
    wallet.lastTransactionAt = new Date();
    await wallet.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Deposit successful",
      data: {
        transaction: {
          id: transaction.id,
          amount: parseFloat(transaction.amount),
          currency: transaction.currency,
          status: transaction.status,
          blockchainHash: transaction.blockchainHash,
          contractAddress: transaction.contractAddress,
          blockchainStatus: transaction.blockchainStatus,
          blockNumber: transaction.blockNumber,
          gasUsed: transaction.gasUsed,
        },
        newBalance: {
          cashBalance: parseFloat(wallet.cashBalance),
          rewardsBalance: parseFloat(wallet.rewardsBalance),
          totalBalance:
            parseFloat(wallet.cashBalance) + parseFloat(wallet.rewardsBalance),
        },
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error processing deposit:", error);
    res.status(500).json({
      success: false,
      message: "Error processing deposit",
      error: error.message,
    });
  }
};

/**
 * Withdraw funds from wallet
 */
exports.withdraw = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.userId;
    const { amount, description, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get wallet
    const wallet = await Wallet.findOne({ where: { userId }, transaction: t });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    // Check if sufficient balance
    if (parseFloat(wallet.cashBalance) < parseFloat(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Create transaction record
    const transaction = await Transaction.create(
      {
        userId,
        walletId: wallet.id,
        type: "withdrawal",
        amount,
        currency: wallet.currency,
        status: "pending", // Will be updated after blockchain confirmation
        description: description || "Cash withdrawal",
        reference,
        balanceType: "cash",
        blockchainStatus: "pending",
      },
      { transaction: t }
    );

    // Generate blockchain hash for withdrawal
    try {
      const user = await User.findByPk(userId, { transaction: t });
      const blockchainResult = await blockchainService.generateWithdrawalHash({
        userId,
        amount,
        currency: wallet.currency,
        walletAddress: user.walletAddress || `user_${userId}`,
        destinationAddress: reference || "external_account",
        transactionId: transaction.id
      });

      // Update transaction with blockchain data
      await transaction.update({
        blockchainHash: blockchainResult.hash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
        blockchainStatus: blockchainResult.status,
        contractAddress: blockchainResult.contractAddress,
        status: "completed", // Mark as completed after blockchain confirmation
        processedAt: new Date(),
      }, { transaction: t });

      console.log(`✅ Withdrawal blockchain hash: ${blockchainResult.hash}`);
    } catch (blockchainError) {
      console.error("⚠️ Blockchain hash generation failed, continuing with withdrawal:", blockchainError.message);
      // Continue with withdrawal even if blockchain fails
      await transaction.update({
        status: "completed",
        processedAt: new Date(),
      }, { transaction: t });
    }

    // Update wallet balance
    wallet.cashBalance = parseFloat(wallet.cashBalance) - parseFloat(amount);
    wallet.lastTransactionAt = new Date();
    await wallet.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Withdrawal successful",
      data: {
        transaction: {
          id: transaction.id,
          amount: parseFloat(transaction.amount),
          currency: transaction.currency,
          status: transaction.status,
          blockchainHash: transaction.blockchainHash,
          contractAddress: transaction.contractAddress,
          blockchainStatus: transaction.blockchainStatus,
          blockNumber: transaction.blockNumber,
          gasUsed: transaction.gasUsed,
        },
        newBalance: {
          cashBalance: parseFloat(wallet.cashBalance),
          rewardsBalance: parseFloat(wallet.rewardsBalance),
          totalBalance:
            parseFloat(wallet.cashBalance) + parseFloat(wallet.rewardsBalance),
        },
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      success: false,
      message: "Error processing withdrawal",
      error: error.message,
    });
  }
};

/**
 * Add rewards to wallet
 */
exports.addRewards = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.user.userId;
    const { amount, description, reference, type = "reward" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Get or create wallet
    let wallet = await Wallet.findOne({ where: { userId }, transaction: t });
    if (!wallet) {
      const user = await User.findByPk(userId);
      wallet = await Wallet.create(
        {
          userId,
          currency: user.currency || "TND",
          cashBalance: 0.0,
          rewardsBalance: 0.0,
        },
        { transaction: t }
      );
    }

    // Create transaction record
    const transaction = await Transaction.create(
      {
        userId,
        walletId: wallet.id,
        type,
        amount,
        currency: wallet.currency,
        status: "completed",
        description: description || "Rewards earned",
        reference,
        balanceType: "rewards",
        processedAt: new Date(),
      },
      { transaction: t }
    );

    // Update wallet balance
    wallet.rewardsBalance =
      parseFloat(wallet.rewardsBalance) + parseFloat(amount);
    wallet.lastTransactionAt = new Date();
    await wallet.save({ transaction: t });

    await t.commit();

    res.json({
      success: true,
      message: "Rewards added successfully",
      data: {
        transaction: {
          id: transaction.id,
          amount: parseFloat(transaction.amount),
          currency: transaction.currency,
          status: transaction.status,
        },
        newBalance: {
          cashBalance: parseFloat(wallet.cashBalance),
          rewardsBalance: parseFloat(wallet.rewardsBalance),
          totalBalance:
            parseFloat(wallet.cashBalance) + parseFloat(wallet.rewardsBalance),
        },
      },
    });
  } catch (error) {
    await t.rollback();
    console.error("Error adding rewards:", error);
    res.status(500).json({
      success: false,
      message: "Error adding rewards",
      error: error.message,
    });
  }
};
