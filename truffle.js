// Allows us to use ES6 in our migrations and tests.
require('babel-register')
/*var bip39 = require("bip39");
var hdkey = require('ethereumjs-wallet/hdkey');
var ProviderEngine = require("web3-provider-engine");
var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
var Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
var Web3 = require("web3");
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

// Get our mnemonic and create an hdwallet
var mnemonic = "all offer tent kitten demand square lyrics cause secret dignity empower unveil";
var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/";
var wallet = hdwallet.derivePath(wallet_hdpath + "0").getWallet();
var address = "0x" + wallet.getAddress().toString("hex");

var access_token = "MtZb7as8pRfiZgXbbNFH";
var providerUrl = "https://rinkeby.infura.io/MtZb7as8pRfiZgXbbNFH";
var engine = new ProviderEngine();

// filters
engine.addProvider(new FilterSubprovider());

engine.addProvider(new WalletSubprovider(wallet, {}));
engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)));
engine.start(); // Required by the provider engine.
*/
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "all offer tent kitten demand square lyrics cause secret dignity empower unveil";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    testnet: {
      provider: new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/MtZb7as8pRfiZgXbbNFH", 0),
      network_id: 4
    }
  }
};
/*

module.exports = {
  networks: {
  	"ropsten": {
      network_id: 4,    // Official ropsten network id
      provider: engine, // Use our custom provider
      from: address     // Use the address we derived
    },

    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
  }
}
*/