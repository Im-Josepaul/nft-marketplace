const { ethers } = require("hardhat");

async function main() {
  const deployContract = await ethers.getContractFactory("erc721");
  const deployedContract = await deployContract.deploy();
  await deployedContract.deployed();
  console.log("Contract deployed to address:", deployedContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);
