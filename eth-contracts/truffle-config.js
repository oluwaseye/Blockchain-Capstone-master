
const HDWalletProvider = require('truffle-hdwallet-provider');

const fs = require('fs');
const MNEMONIC = fs.readFileSync(".secret").toString().trim();
const ENDPOINT = "https://rinkeby.infura.io/v3/d7c39bd2a0a8461898a51b4a17b4a287";

module.exports = {

  networks: {

    //
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    }
    ,
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(MNEMONIC, ENDPOINT)
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },

  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.2",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
}
