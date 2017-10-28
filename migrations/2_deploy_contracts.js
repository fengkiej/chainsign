//var ConvertLib = artifacts.require("./ConvertLib.sol");
var ChainSign = artifacts.require("./ChainSign.sol");
var DigitalMaterai = artifacts.require("./DigitalMaterai.sol");

module.exports = function(deployer) {
 // deployer.deploy(ConvertLib);
 // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(ChainSign);
  deployer.deploy(DigitalMaterai, 1000000)
};
