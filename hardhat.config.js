require('hardhat-contract-sizer')
require('@nomicfoundation/hardhat-toolbox')
require('@nomicfoundation/hardhat-chai-matchers')
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-web3')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.9',

  networks: {
    hardhat: {
      chainId: 1337
    }
    // mumbai: {
    //   url: "https://rpc-mumbai.matic.today",
    //   accounts: [process.env.pk]
    // },
    // polygon: {
    //   url: "https://polygon-rpc.com/",
    //   accounts: [process.env.pk]
    // }
  }
}
