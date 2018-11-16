var Web3 = require("web3"); //引入web3支持，我本地使用的是web3^0.18.4
var fs = require("fs"); //文件读写
var Tx = require("ethereumjs-tx"); //引入以太坊js交易支持
var solc = require('solc');


//初始化web3
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.23.164:8545"));
}

var contractAddress = "0xdf235841277061548a56c011b8a3da806e045d67";
var source = fs.readFileSync('./contracts/SAIToken.sol', 'utf8');

// console.info(source);
var output = solc.compile(source, 1);

var abi = output.contracts[':SAIToken'];
// console.info(JSON.parse(abi.metadata).output.abi);

abi = JSON.parse(abi.metadata).output.abi;

var from = "0x018673c699738c569d88d31167be1d2cb97c443e";
var fromPrivateKey = "0f8624455c8df1550b2dd0ccb6d1861230345709556d0d3893378b374c7a975a";


var to = "0x1340bA24706366ae852b6D6da31cdf247E4eD3FF";
var tokenValue = 1;

//单位转换示例
var balance = web3.eth.getBalance(from);
console.info("balance of holder in wei is : " + balance.toString());
console.info("balance of holder in gwei is : " + web3.fromWei(balance, 'gwei'));
console.info("balance of holder in finney is : " + web3.fromWei(balance, 'finney'));
console.info("balance of holder in ether is : " + web3.fromWei(balance, 'ether'));

//当前的gas价格。这个值由最近几个块的gas价格的中值决定
var gasPrice = web3.eth.gasPrice;
//console.logs("gasPrice in wei is : " +gasPrice.toString(10)); // "10000000000000"
//console.logs("gasPrice in gwei is : " + web3.fromWei(gasPrice.toString(10), 'gwei'));
var gasLimit = 80000;

//获取nonce
var count = web3.eth.getTransactionCount(from);

var MMTContract = web3.eth.contract(abi).at(contractAddress)
var decimal = MMTContract.decimals();
var balance = MMTContract.balanceOf(from);
var tokenName = MMTContract.name();
var tokenSymbol = MMTContract.symbol();
console.info("tokenSymbol: " + tokenSymbol);
console.info("tokenName: " + tokenName);
console.info("balance in wei: " + balance);
console.info("decimal: " + decimal);


//私钥
// var privKey = new Buffer(fromPrivateKey, 'hex'); l
var privKey = Buffer.from(fromPrivateKey, 'hex');
console.info(privKey);

//交易信息
var rawTransaction = {
    "from": from,
    "nonce": web3.toHex(count),
    "gasPrice": web3.toHex(gasPrice),
    "gasLimit": web3.toHex(gasLimit),
    "to": contractAddress,
    "value": "0x0",
    "data": MMTContract.transfer.getData(to, web3.toWei(tokenValue,'ether')),
    "chainId": "*"
};
//实例交易
var tx = new Tx(rawTransaction);
//私钥交易签名
tx.sign(privKey);
//交易发送前实例化
var serializedTx = tx.serialize();
//发送交易，留下hash
web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
    if (!err){
        console.log(hash);
    } else {
        console.log(err);
    }
});



