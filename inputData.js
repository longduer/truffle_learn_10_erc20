var abiDecoder = require('abi-decoder');
var fs = require('fs');
var solc = require('solc');

var Web3 = require("web3"); //引入web3支持，我本地使用的是web3^0.18.

//初始化web3
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.23.164:8545"));
}

var txId = '0xc44314bdad91ab0cc1693bf96f29b3d866a771214532692b69af4a1f5d4dd02b';
var tx = web3.eth.getTransaction(txId);
console.info(tx.input);

var source = fs.readFileSync('./contracts/SAIToken.sol', 'utf8');

// console.info(source);
var output = solc.compile(source, 1);
//
// for(var contractName in output.contracts){
//     console.log(contractName + ' bytecode: ' + output.contracts[contractName].bytecode);
//     console.log(contractName + ' abi: ' + output.contracts[contractName].interface)
// }

var abi = output.contracts[':SAIToken'];
console.info(JSON.parse(abi.metadata).output.abi);
//

abi = JSON.parse(abi.metadata).output.abi;
//
// console.info(abi);
// //
abiDecoder.addABI(abi);
//
const decodedData = abiDecoder.decodeMethod(tx.input);
console.info(decodedData);


