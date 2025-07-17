const { ethers } = require("ethers");
const contractABI =
  require("../artifacts/contracts/InvestmentManager.sol/InvestmentManager.json").abi;
require("dotenv").config();

// Commented out live blockchain connections
// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.INFURA_SEPOLIA,
// );
// const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
// const contract = new ethers.Contract(
//   process.env.INVESTMENT_CONTRACT_ADDRESS,
//   contractABI,
//   wallet,
// );

const blockchainService = require("../services/blockchain.service");

// Enhanced implementation with real blockchain integration
exports.recordInvestment = async (projectId, userAddress, amountTND) => {
  try {
    console.log(
      `[BLOCKCHAIN] Recording investment: Project ${projectId}, User ${userAddress}, Amount ${amountTND} TND`,
    );

    // Use the new blockchain service to generate investment hash
    const blockchainResult = await blockchainService.generateInvestmentHash({
      projectId,
      userId: userAddress, // Using userAddress as userId for now
      userAddress,
      amount: amountTND,
      currency: "TND"
    });

    console.log(
      `[BLOCKCHAIN] Investment recorded successfully: ${blockchainResult.hash}`,
    );

    // Return the transaction hash for backward compatibility
    return blockchainResult.hash;
  } catch (error) {
    console.error("Error in blockchain investment:", error);
    throw new Error(
      `Blockchain transaction failed: ${error.message || "Unknown error"}`,
    );
  }
};
