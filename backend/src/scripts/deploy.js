const hre = require("hardhat");

/**
 * Deploys the InvestmentManager, ProjectRegistry, and RentDistributor smart contracts using Hardhat.
 *
 * The RentDistributor contract is deployed with the address of the deployed InvestmentManager contract as a constructor argument. Deployment addresses are logged to the console.
 *
 * @returns {Promise<void>}
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy InvestmentManager
  const InvestmentManager =
    await hre.ethers.getContractFactory("InvestmentManager");
  const investmentManager = await InvestmentManager.deploy();
  await investmentManager.deployed();
  console.log("InvestmentManager deployed at:", investmentManager.address);

  // Deploy ProjectRegistry
  const ProjectRegistry =
    await hre.ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy();
  await projectRegistry.deployed();
  console.log("ProjectRegistry deployed at:", projectRegistry.address);

  // Deploy RentDistributor with InvestmentManager address
  const RentDistributor =
    await hre.ethers.getContractFactory("RentDistributor");
  const rentDistributor = await RentDistributor.deploy(
    investmentManager.address,
  );
  await rentDistributor.deployed();
  console.log("RentDistributor deployed at:", rentDistributor.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
