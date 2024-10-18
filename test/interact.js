const hre = require("hardhat");
require("dotenv").config();
const ContractJson = require("../artifacts/contracts/ERC721.sol/erc721.json");
// The ABI is very important -- it's the interface to your contract, including
// the different available functions that are exposed for other contracts,
// accounts, etc. to call.
const abi = ContractJson.abi;

async function main() {
    //We are creating an instance of the Alchemy URL to the testnet here.
    const alchemy = new hre.ethers.providers.AlchemyProvider(process.env.API_URL_KEY);
    // We're creating an instance of the same wallet private key 
    const userWallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, alchemy);

    // Get the deployed contract. We need both the specific CONTRACT_ADDRESS
    const erc721 = new hre.ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        abi,
        userWallet
    )

    // We're going to issue two write-transactions to modify the state
    // of the Polygon blockchain via our Greeter smart contract.
    
    // The first transaction sets a new greeting with setGreeting, and then
    // waits for the transaction to be mined before doing a sanity
    // check and checking the new greeting state.
    const setTx1 = await erc721.setPrice(25000);
    await setTx1.wait();
    console.log("before: " + await erc721.readPrice());

    // The second transaction does the exact same thing with a new input.
    const setTx2 = await erc721.setPrice(35000);
    await setTx2.wait();
    console.log("before: " + await erc721.readPrice());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
});