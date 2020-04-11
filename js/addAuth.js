var Web3 = require('web3');
web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/96849b65e61e49acb2b3d396c97e0c37"));
console.log("123");
const RegistryContractJSON = require('../build/contracts/RegistryContract.json');
const ContractCareRecordJSON = require('../build/contracts/CareRecordConsent.json');

const contractAddr = '0xa8954d95d89c7fb411fC3BEf8E90F9c1bb4AAAED';
//const RegistryContract = new web3.eth.Contract(RegistryContractJSON.abi, contractAddr);
const CareRecordContract = new web3.eth.Contract(ContractCareRecordJSON.abi, contractAddr);

const privateKey = '213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50';
const userAccount = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
const userAddr = userAccount.address;

if (typeof web3 == 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("321")
} else {
    console.log("123");
    var dlist = [web3.utils.keccak256('a'), web3.utils.keccak256('b'), web3.utils.keccak256('c')]
    var txdata = CareRecordContract.methods.addAuthWithLevel('NTUHH', dlist, [1, 2, 3], 20190101, 20190401).encodeABI()
        //var txdata = CareRecordContract.methods.transferEBM("0x0c125784488edfFA6a72ecd8CB67445796a108b3").encodeABI()
        //console.log(txdata)
    var Tx = require('ethereumjs-tx').Transaction;
    //var privateKey = new Buffer('213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50', 'hex')
    web3.eth.getTransactionCount('0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D', "pending").then(function(nonce) {
        var rawTx = {
            nonce: Web3.utils.toHex(nonce),
            gasPrice: Web3.utils.toHex(10000),
            gasLimit: Web3.utils.toHex(3000000),
            to: contractAddr,
            value: '0x00',
            data: txdata
        }
        var tx = new Tx(rawTx, { chain: 'ropsten' });
        var pKey = new Buffer('213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50', 'hex');
        tx.sign(pKey);
        var serializedTx = tx.serialize();
        console.log(serializedTx.toString('hex'));
        // web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(receipt, err, hash) {
        //         if (!err) {
        //             console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"

        //         } else {
        //             console.log(err)
        //         }
        //     }).on('transactionHash', hash => {
        //         console.log(hash);
        //     })
        //     .on('confirmation', (confirmationNumber, receipt) => {
        //         // console.log('confirmation', confirmationNumber);
        //     })
        //     .on('receipt', function(receipt) {
        //         console.log("receipt:\n" + receipt);
        //         //resolve(receipt)
        //     })
        //     .on('error', function(err) {
        //         console.log("err:\n" + err);
        //         //reject(err);
        //     })
    })
}