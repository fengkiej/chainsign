//var ConvertLib = artifacts.require("./ConvertLib.sol");
var ChainSign = artifacts.require("./ChainSign.sol");

module.exports = function(deployer) {
 // deployer.deploy(ConvertLib);
 // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(ChainSign);
};
