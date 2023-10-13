const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
   
  // Deploy the Xela Token Contract
  const xelaTokenContract = await hre.ethers.deployContract("Xela");
  await xelaTokenContract.waitForDeployment();
  const xelaTokenContractAddr = xelaTokenContract.target;
  console.log("Xela Token Contract deployed to: ", xelaTokenContractAddr);

  // Deploy the Exchange Contract
  const exchangeContract = await hre.ethers.deployContract("Exchange", [xelaTokenContractAddr]);
  await exchangeContract.waitForDeployment();
  const exchangeContractAddr = exchangeContract.target;
  console.log("Exchange Contract deployed to: ", exchangeContractAddr);

  // Wait 30 seconds to let Etherscan catch up with the deployments
  await sleep(30 * 1000);

  // verify the Xela Token Contract on Etherscan
  await hre.run("verify:verify", {
    address: xelaTokenContractAddr,
    constructorArguments: [],
    contract: "contracts/XelaToken.sol:Xela",
  });

  // verify the Exchange Contract on Etherscan
  await hre.run("verify:verify", {
    address: exchangeContractAddr,
    constructorArguments: [xelaTokenContractAddr],
    contract: "contracts/Exchange.sol:Exchange"
  });

}

// Call the main function and catch if there is any error
main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exitCode(1);
      });
