const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const deployContract = await ethers.getContractFactory("Marketplace");  //Finds out the contract that we need to deploy
  const deployedContract = await deployContract.deploy(); //deploys the contract
  await deployedContract.deployed();  //waits till the deployment is over 
  console.log("Contract deployed to address:", deployedContract.address); //prints the addres where the contract is deployed.
   
  // Update the .env file with the new contract address
  const envFilePath = ".env";

  try {
    // Read the .env file content
    const envContent = fs.readFileSync(envFilePath, "utf8");
  
    // Split content by lines and replace the line that starts with "CONTRACT_ADDRESS"
    const updatedEnvContent = envContent
      .split("\n")
      .map(line => {
        if (line.trim().startsWith("CONTRACT_ADDRESS")) {
          return `CONTRACT_ADDRESS = ${deployedContract.address}`;
        }
        return line;
      })
      .join("\n");
  
    // Write the updated content back to the .env file
    fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");
    console.log("CONTRACT_ADDRESS updated successfully in .env file.");
    
  } catch (error) {
    console.error("Error updating .env file:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);
