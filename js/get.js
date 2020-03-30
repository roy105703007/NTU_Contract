var Web3 = require('web3');
let Tx = require('ethereumjs-tx');

web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/96849b65e61e49acb2b3d396c97e0c37"));

/*後台公私鑰*/
let backendAddr = '0xac66e1be03223e4ccac17b1260f05eb925c4812d';
let backendPrivateKey = Buffer.from('213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50', 'hex');
let backendRawPrivateKey = '0x213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50';


const CareRecordConsent = require('../build/contracts/CareRecordConsent.json');
const RegistryContract = require('../build/contracts/RegistryContract.json');
let ContractAddr = "0x6B4e27bC0cA0517fB1164e6A9B5931E0B5De25ba";
// Passing in the eth or web3 package is necessary to allow retrieving chainId, gasPrice and nonce automatically
// for accounts.signTransaction().



if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("321")
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/96849b65e61e49acb2b3d396c97e0c37"));
}

signTx(backendAddr, backendRawPrivateKey, ContractAddr, '0x' + '59e26be1' + 'Ac66E1BE03223e4CCAc17b1260f05EB925c4812D')

/*sign rawtx*/
function signTx(userEthAddr, userRawPrivateKey, contractAddr, encodedData) {
    return new Promise((resolve, reject) => {

        web3.eth.getTransactionCount(userEthAddr)
            .then(nonce => {
                console.log("nonce:" + nonce);
                console.log(userRawPrivateKey);
                let userPrivateKey = new Buffer.from(userRawPrivateKey.slice(2), 'hex');
                console.log(userPrivateKey);
                let txParams = {
                    nonce: web3.utils.toHex(nonce),
                    gas: 4700000,
                    gasPrice: 0,
                    to: contractAddr,
                    data: encodedData,
                };

                console.log(txParams);

                let tx = new Tx(txParams);
                tx.sign(userPrivateKey);
                const serializedTx = tx.serialize();
                const rawTx = '0x' + serializedTx.toString('hex');

                console.log('☆ RAW TX ☆\n', rawTx);

                web3.eth.sendSignedTransaction(rawTx)
                    .on('transactionHash', hash => {
                        console.log(hash);
                    })
                    .on('confirmation', (confirmationNumber, receipt) => {
                        // console.log('confirmation', confirmationNumber);
                    })
                    .on('receipt', function(receipt) {
                        console.log("receipt:\n" + receipt);
                        resolve(receipt)
                    })
                    .on('error', function(err) {
                        console.log("err:\n" + err);
                        reject(err);
                    })
            })

    })
}