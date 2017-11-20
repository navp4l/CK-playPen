var Web3 = require('web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;

var endpoint = 'http://localhost:8555';

var web3 = new Web3(
    new Web3.providers.HttpProvider(endpoint)
);

var kittyContractABI = require("../ABI/KittyCore.json");
var saleContractABI = require("../ABI/SaleClockAuction.json");
var siringContractABI = require("../ABI/SiringClockAuction.json");

var kittyContractAddrs = "0x16baf0de678e52367adc69fd067e5edd1d33e3bf";
var saleContractAddrs = "0x8a316edee51b65e1627c801dbc09aa413c8f97c2";
var siringContractAddrs = "0x07ca8a3a1446109468c3cf249abb53578a2bbe40";

var kittyContractInst = web3.eth.contract(kittyContractABI).at(kittyContractAddrs);
var salesContractInst = web3.eth.contract(saleContractABI).at(saleContractAddrs);
var siringContractInst = web3.eth.contract(siringContractABI).at(siringContractAddrs);

var account1PublicKey = "0xdeF7a10DE78d9474Daf9D33C09e05bC50391E9F4";
var account2PublicKey = "0x5b43537e86d88f13b6c292d26607ac79365e411d";

// var accountPrivateKey = ""

async function parentFunction(contract, methodName, ...args) {
  return new Promise( (resolve, reject) => {
    contract[methodName](...args, (err, result) => {
      if (!err) resolve(result);
      else reject(err);
    });
  });
}

async function placeBidForKitty(_from, kittyId) {
  return promise = new Promise( (resolve, reject) => {
    const callDataForBid = salesContractInst.bid.getData(kittyId);
    console.log(`callDataForBid :: ${callDataForBid}`);
    let txnObj = buildTxnObjectPayable(_from, kittyContractAddrs, callDataForBid, web3.toWei(1, "ether"), 100000);
    console.log(`Txn object is :: from: ${txnObj.from}, to: ${txnObj.to}, data: ${txnObj.data}, value: ${txnObj.value}, gas: ${txnObj.gas}, gasPrice: ${txnObj.gasPrice}`);
    web3.eth.sendTransaction(txnObj, (err, result) => {
      if(err) reject(err);
      else resolve(result);
    });
  }).then(result => {
    console.log(`The txn hash is ${result}`);
  }, err => {
    console.error(`Error intercepted :: ${err}`);
  });
}

function buildTxnObjectPayable(...args) {
  console.log(`Incoming arguments ${args}`);
  return {
    from: args[0],
    to: args[1],
    data: args[2],
    value: args[3],
    gas: args[4],
    gasPrice: web3.eth.gasPrice
  };
}

function buildTxnObjectCall(...args) {
  console.log(`Incoming arguments ${args}`);
  return {
    from: args[0],
    to: args[1],
    data: args[2]
  };
}

// placeBidForKitty(account1PublicKey, 8);
// parentFunction(salesContractInst, "bid", 8);

async function getKittyDetails(_kittyId){
  const attrs = await parentFunction(kittyContractInst, "getKitty", _kittyId);
  const kitty = {
    isGestating: attrs[0],
    isReady: attrs[1],
    cooldownIndex: attrs[2].toNumber(),
    nextActionAt: attrs[3].toNumber(),
    siringWithId: attrs[4].toNumber(),
    birthTime: attrs[5].toNumber(),
    matronId: attrs[6].toNumber(),
    sireId: attrs[7].toNumber(),
    generation: attrs[8].toNumber(),
    genes: attrs[9].toString()
  };
  console.log(`Kitty details ${_kittyId}::`,kitty);
  return kitty;
}

getKittyDetails(8);
getKittyDetails(9);

// web3.personal.unlockAccount("0xdef7a10de78d9474daf9d33c09e05bc50391e9f4", "p@ssword12", 50000)
