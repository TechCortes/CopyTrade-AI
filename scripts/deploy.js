const hre = require("hardhat");

async function main() {
  console.log("Starting deployment to Supra network...");

  // Deploy AgentRegistry
  console.log("Deploying AgentRegistry...");
  const AgentRegistry = await hre.ethers.getContractFactory("AgentRegistry");
  const registry = await AgentRegistry.deploy();
  await registry.deployed();
  console.log(`✅ AgentRegistry deployed at: ${registry.address}`);

  // Deploy CopyTradeSimulator
  console.log("Deploying CopyTradeSimulator...");
  const CopyTradeSimulator = await hre.ethers.getContractFactory("CopyTradeSimulator");
  const copy = await CopyTradeSimulator.deploy();
  await copy.deployed();
  console.log(`✅ CopyTradeSimulator deployed at: ${copy.address}`);

  // Save deployment addresses
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log(`AgentRegistry: ${registry.address}`);
  console.log(`CopyTradeSimulator: ${copy.address}`);
  console.log("=".repeat(50));

  // Verify contracts (optional)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await registry.deployTransaction.wait(5);
    await copy.deployTransaction.wait(5);

    console.log("🔍 Verifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: registry.address,
        constructorArguments: [],
      });
      console.log("✅ AgentRegistry verified");
    } catch (error) {
      console.log("❌ AgentRegistry verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: copy.address,
        constructorArguments: [],
      });
      console.log("✅ CopyTradeSimulator verified");
    } catch (error) {
      console.log("❌ CopyTradeSimulator verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });