const hre = require("hardhat");
require("dotenv").config();
const ContractJson = require("../artifacts/contracts/Marketplace.sol/Marketplace.json");
// The ABI is very important -- it's the interface to your contract, including
// the different available functions that are exposed for other contracts,
// accounts, etc. to call.
const abi = ContractJson.abi;
const uri = "https://amaranth-odd-ptarmigan-638.mypinata.cloud/ipfs/QmbypZNFtZuQV8Qx4pbDjdJoChGigYLqGMbK574qdVBsjz";
const name = "Doggy Image";
const price = hre.ethers.utils.parseUnits("2", "ether").toString();
const address = "0x2f576398134BC8AdDF242253816bfd2D1c941A4b";
const id = 1;
var amount = 10;

async function main() {
    //We are creating an instance of the Alchemy URL to the testnet here.
    const alchemy = new hre.ethers.providers.JsonRpcProvider(process.env.API_URL_KEY);  //For getting the local deployed contract, give this:"http://127.0.0.1:8545"
    // We're creating an instance of the same wallet private key 
    const userWallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, alchemy);

    // Get the deployed contract. We need both the specific CONTRACT_ADDRESS
    const Marketplace = new hre.ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        abi,
        userWallet
    );

    console.log(Marketplace);
    console.log(price);

    // Prepare the transaction
    try{
        const tx = await Marketplace.deployERC1155(uri, id, name, price, address, {
            // Manually set gas parameters to avoid "underpriced" transaction error
            maxPriorityFeePerGas: hre.ethers.utils.parseUnits('30', 'gwei'), // 30 Gwei tip
            maxFeePerGas: hre.ethers.utils.parseUnits('50', 'gwei'),         // 50 Gwei max fee
            gasLimit: 50000  // Adjust gas limit as needed
        });
        const receipt = await tx.wait();
    }
    catch(error){
        console.log("deployERC1155 function failed /n");
        console.error('Error calling function:', error);
    }
    

    // console.log("Transaction sent with hash: ", tx.hash);

    // const deployTx = await Marketplace.deployERC1155(uri,id,name,price,address);
    // deployTx.wait();

    
    // console.log("Transaction confirmed with receipt: ", receipt);
    try{
        var index = await Marketplace.getIndexById(id); 
    }
    catch(error){
        console.log("getIndexById function failed /n");
        console.error('Error calling function:', error);
    }

    try{
        const mintTx = await Marketplace.mintERC1155(index,amount);
        await mintTx.wait(); 
    }
    catch(error){
        console.log("mintERC1155 function failed /n");
        console.error('Error calling function:', error);
    }
    

    try{
        var numberofNFT = await Marketplace.getCountERC1155byIndex(index,id);
    }
    catch(error){
        console.log("getCountERC1155byIndex function failed /n");
        console.error('Error calling function:', error);
    }
    console.log("Number of NFT's in the user account is: ",numberofNFT);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});