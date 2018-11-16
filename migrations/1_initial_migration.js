// var Ballot = artifacts.require("./Ballot.sol");
var SAIToken = artifacts.require("./SAIToken.sol");

module.exports = function(deployer) {
  // deployer.deploy(Ballot,['China','USA','English','Franch','German']);
    deployer.deploy(SAIToken,
        '0x018673c699738c569d88d31167be1d2cb97c443e',
        '0x01938dfffc8a88d3f9c880b18227cd6307ad8370',
        '0x00963da191743eb2787416f1ac32a5cf5a187cb6');
};
