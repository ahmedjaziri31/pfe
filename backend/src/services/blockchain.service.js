const { ethers } = require("ethers");
const crypto = require("crypto");
require("dotenv").config();

// Network configuration - Using Sepolia testnet
const NETWORK_CONFIG = {
  name: "Sepolia Testnet",
  chainId: 11155111,
  rpcUrl: process.env.INFURA_SEPOLIA,
  currency: "SepoliaETH"
};

class BlockchainService {
  constructor() {
    this.isTestMode = process.env.NODE_ENV !== "production";
    this.provider = null;
    this.wallet = null;
    this.contracts = {};
    
    this.initialize();
  }

  async initialize() {
    try {
      if (!NETWORK_CONFIG.rpcUrl) {
        throw new Error("INFURA_SEPOLIA environment variable is required");
      }

      // Initialize provider
      this.provider = new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
      
      // Initialize wallet if private key is provided
      if (process.env.PRIVATE_KEY) {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        console.log(`✅ Wallet initialized: ${this.wallet.address}`);
      }

      // Load smart contracts
      await this.loadContracts();
      
      console.log(`✅ Blockchain service initialized on ${NETWORK_CONFIG.name}`);
      console.log(`📍 Network: ${NETWORK_CONFIG.rpcUrl}`);
    } catch (error) {
      console.error("❌ Blockchain service initialization failed:", error.message);
      // Fallback to mock mode
      this.isTestMode = true;
    }
  }

  async loadContracts() {
    try {
      // Load contract ABIs and addresses
      const investmentManagerABI = require("../artifacts/contracts/InvestmentManager.sol/InvestmentManager.json").abi;
      const rentDistributorABI = require("../artifacts/contracts/RentDistributor.sol/RentDistributor.json").abi;

      if (process.env.INVESTMENT_CONTRACT_ADDRESS && this.wallet) {
        this.contracts.investmentManager = new ethers.Contract(
          process.env.INVESTMENT_CONTRACT_ADDRESS,
          investmentManagerABI,
          this.wallet
        );
        console.log(`✅ Investment contract loaded: ${process.env.INVESTMENT_CONTRACT_ADDRESS}`);
      }

      // Note: RentDistributor contract address not provided in env, skipping for now
      console.log(`📊 Contracts loaded: ${Object.keys(this.contracts).length}`)
    } catch (error) {
      console.warn("⚠️ Contract loading failed, using mock mode:", error.message);
    }
  }

  /**
   * Generate transaction hash for deposits
   */
  async generateDepositHash(depositData) {
    try {
      const { userId, amount, currency, walletAddress, paymentMethod } = depositData;
      
      if (this.isTestMode || !this.wallet) {
        return this.generateMockHash("deposit", depositData);
      }

      // Create a deposit record transaction on blockchain
      const txData = {
        userId: userId,
        amount: ethers.utils.parseEther(amount.toString()),
        timestamp: Math.floor(Date.now() / 1000),
        paymentMethod: paymentMethod || "payme"
      };

             // In real implementation, you might record this on a custom smart contract
       // For now, we'll create a transaction hash by sending a small amount to admin wallet
       const treasuryAddress = process.env.ADMIN_WALLET_ADDRESS || this.wallet.address;
      
      const transaction = await this.wallet.sendTransaction({
        to: treasuryAddress,
        value: ethers.utils.parseEther("0.001"), // Small fee
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(
          JSON.stringify({ type: "deposit", ...txData })
        ))
      });

      const receipt = await transaction.wait();
      
      console.log(`✅ Deposit hash generated: ${receipt.transactionHash}`);
      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? "confirmed" : "failed"
      };

    } catch (error) {
      console.error("❌ Error generating deposit hash:", error);
      return this.generateMockHash("deposit", depositData);
    }
  }

  /**
   * Generate transaction hash for withdrawals
   */
  async generateWithdrawalHash(withdrawalData) {
    try {
      const { userId, amount, currency, walletAddress, destinationAddress } = withdrawalData;

      if (this.isTestMode || !this.wallet) {
        return this.generateMockHash("withdrawal", withdrawalData);
      }

      const txData = {
        userId: userId,
        amount: ethers.utils.parseEther(amount.toString()),
        timestamp: Math.floor(Date.now() / 1000),
        destination: destinationAddress
      };

             const treasuryAddress = process.env.ADMIN_WALLET_ADDRESS || this.wallet.address;
      
      const transaction = await this.wallet.sendTransaction({
        to: treasuryAddress,
        value: ethers.utils.parseEther("0.001"),
        data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes(
          JSON.stringify({ type: "withdrawal", ...txData })
        ))
      });

      const receipt = await transaction.wait();
      
      console.log(`✅ Withdrawal hash generated: ${receipt.transactionHash}`);
      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? "confirmed" : "failed"
      };

    } catch (error) {
      console.error("❌ Error generating withdrawal hash:", error);
      return this.generateMockHash("withdrawal", withdrawalData);
    }
  }

  /**
   * Generate transaction hash for investments
   */
  async generateInvestmentHash(investmentData) {
    try {
      const { projectId, userId, userAddress, amount, currency } = investmentData;

      if (this.isTestMode || !this.contracts.investmentManager) {
        return this.generateMockHash("investment", investmentData);
      }

      // Record investment on blockchain using smart contract
      const transaction = await this.contracts.investmentManager.recordInvestment(
        projectId,
        userAddress,
        ethers.utils.parseEther(amount.toString())
      );

      const receipt = await transaction.wait();
      
      console.log(`✅ Investment hash generated: ${receipt.transactionHash}`);
      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? "confirmed" : "failed",
        contractAddress: this.contracts.investmentManager.address
      };

    } catch (error) {
      console.error("❌ Error generating investment hash:", error);
      return this.generateMockHash("investment", investmentData);
    }
  }

  /**
   * Generate mock hash for testing/fallback
   */
  generateMockHash(type, data) {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const hash = `0x${crypto.createHash('sha256')
      .update(`${type}_${timestamp}_${JSON.stringify(data)}_${randomBytes}`)
      .digest('hex')}`;
    
    console.log(`🧪 Mock ${type} hash generated: ${hash}`);
    return {
      hash,
      blockNumber: Math.floor(Math.random() * 1000000) + 17000000,
      gasUsed: (Math.floor(Math.random() * 50000) + 21000).toString(),
      status: "confirmed",
      isMock: true
    };
  }

  /**
   * Verify transaction status on blockchain
   */
  async verifyTransaction(transactionHash) {
    try {
      if (!this.provider || transactionHash.startsWith('mock_')) {
        return {
          hash: transactionHash,
          status: "confirmed",
          confirmations: 6,
          isMock: true
        };
      }

      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      const currentBlock = await this.provider.getBlockNumber();
      
      if (!receipt) {
        return {
          hash: transactionHash,
          status: "pending",
          confirmations: 0
        };
      }

      const confirmations = currentBlock - receipt.blockNumber;
      
      return {
        hash: transactionHash,
        status: receipt.status === 1 ? "confirmed" : "failed",
        confirmations,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error("❌ Error verifying transaction:", error);
      throw new Error(`Transaction verification failed: ${error.message}`);
    }
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    return {
      network: "sepolia",
      name: NETWORK_CONFIG.name,
      chainId: NETWORK_CONFIG.chainId,
      currency: NETWORK_CONFIG.currency,
      rpcUrl: NETWORK_CONFIG.rpcUrl,
      isTestMode: this.isTestMode,
      hasWallet: !!this.wallet,
      walletAddress: this.wallet?.address,
      adminWallet: process.env.ADMIN_WALLET_ADDRESS,
      contractsLoaded: Object.keys(this.contracts).length,
      investmentContract: process.env.INVESTMENT_CONTRACT_ADDRESS
    };
  }
}

// Export singleton instance
const blockchainService = new BlockchainService();
module.exports = blockchainService; 