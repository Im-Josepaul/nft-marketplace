/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { API_URL_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "amoy",
  networks: {
    hardhat: {},
    amoy: {
      url: API_URL_KEY,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};
