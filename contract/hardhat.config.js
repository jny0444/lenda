require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.5.16",
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
