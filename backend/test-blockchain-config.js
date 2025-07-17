require("dotenv").config();
const blockchainService = require("./src/services/blockchain.service");

async function testBlockchainConfig() {
  console.log("🧪 Testing Blockchain Configuration");
  console.log("=====================================");
  
  // Wait for service to initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Get network info
  const networkInfo = blockchainService.getNetworkInfo();
  
  console.log("📊 Network Information:");
  console.log(`   Network: ${networkInfo.network}`);
  console.log(`   Name: ${networkInfo.name}`);
  console.log(`   Chain ID: ${networkInfo.chainId}`);
  console.log(`   Currency: ${networkInfo.currency}`);
  console.log(`   RPC URL: ${networkInfo.rpcUrl}`);
  console.log(`   Test Mode: ${networkInfo.isTestMode}`);
  console.log(`   Has Wallet: ${networkInfo.hasWallet}`);
  console.log(`   Wallet Address: ${networkInfo.walletAddress}`);
  console.log(`   Admin Wallet: ${networkInfo.adminWallet}`);
  console.log(`   Investment Contract: ${networkInfo.investmentContract}`);
  console.log(`   Contracts Loaded: ${networkInfo.contractsLoaded}`);
  
  console.log("\n🔧 Environment Variables Check:");
  console.log(`   ADMIN_WALLET_ADDRESS: ${process.env.ADMIN_WALLET_ADDRESS ? '✅ Set' : '❌ Missing'}`);
  console.log(`   PRIVATE_KEY: ${process.env.PRIVATE_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   INFURA_API_KEY: ${process.env.INFURA_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   INVESTMENT_CONTRACT_ADDRESS: ${process.env.INVESTMENT_CONTRACT_ADDRESS ? '✅ Set' : '❌ Missing'}`);
  console.log(`   INFURA_SEPOLIA: ${process.env.INFURA_SEPOLIA ? '✅ Set' : '❌ Missing'}`);
  
  // Test mock hash generation
  console.log("\n🧮 Testing Hash Generation:");
  
  try {
    const depositHash = await blockchainService.generateDepositHash({
      userId: 123,
      amount: 100.50,
      currency: "TND",
      walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      paymentMethod: "test"
    });
    
    console.log("   ✅ Deposit Hash:", depositHash.hash);
    console.log("   📦 Block Number:", depositHash.blockNumber);
    console.log("   ⛽ Gas Used:", depositHash.gasUsed);
    console.log("   📋 Status:", depositHash.status);
    
  } catch (error) {
    console.log("   ❌ Hash Generation Failed:", error.message);
  }
  
  // Test investment hash if contract is available
  if (networkInfo.hasWallet && networkInfo.investmentContract) {
    console.log("\n💰 Testing Investment Hash Generation:");
    
    try {
      const investmentHash = await blockchainService.generateInvestmentHash({
        projectId: 1,
        userId: 123,
        userAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        amount: 1000.00,
        currency: "TND"
      });
      
      console.log("   ✅ Investment Hash:", investmentHash.hash);
      console.log("   📦 Block Number:", investmentHash.blockNumber);
      console.log("   ⛽ Gas Used:", investmentHash.gasUsed);
      console.log("   📋 Status:", investmentHash.status);
      console.log("   🏠 Contract:", investmentHash.contractAddress);
      
    } catch (error) {
      console.log("   ❌ Investment Hash Generation Failed:", error.message);
    }
  }
  
  console.log("\n✅ Blockchain configuration test completed!");
  process.exit(0);
}

testBlockchainConfig().catch(error => {
  console.error("❌ Test failed:", error);
  process.exit(1);
}); 