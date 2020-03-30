var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("321")
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/2cc4b410a12744769c5b7c011fb716fa"));
    console.log("123");
    const RegistryContractJSON = require('../build/contracts/RegistryContract.json');
    const ContractCareRecordJSON = require('../build/contracts/CareRecordConsent.json');

    const contractAddr = '0x1d21d6Ac8F65340a56c84EF4Eb62Bd6Fc9D04E78';
    const RegistryContract = new web3.eth.Contract(RegistryContractJSON.abi, contractAddr);
    const CareRecordContract = new web3.eth.Contract(ContractCareRecordJSON.abi);

    const privateKey = '213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50';
    const userAccount = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
    const userAddr = userAccount.address;

    var txdata = RegistryContract.methods.registerUser('A130519512', '0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D', '0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D').encodeABI()
    var Tx = require('ethereumjs-tx').Transaction;
    //var privateKey = new Buffer('213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50', 'hex')
    web3.eth.getTransactionCount('0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D', "pending").then(function(nonce) {

            var rawTx = {
                nonce: Web3.utils.toHex(nonce),
                gasPrice: Web3.utils.toHex(10),
                gasLimit: Web3.utils.toHex(3000000),
                to: '0x1d21d6Ac8F65340a56c84EF4Eb62Bd6Fc9D04E78',
                value: '0x00',
                data: txdata
            }
            var tx = new Tx(rawTx, { chain: 'ropsten' });
            var pKey = new Buffer('213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50', 'hex');
            tx.sign(pKey);
            var serializedTx = tx.serialize();
            //console.log(serializedTx.toString('hex'));
            //f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function(receipt, err, hash) {
                    if (!err) {
                        console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"

                    } else {
                        console.log(err)
                    }
                }).on('transactionHash', hash => {
                    console.log(hash);
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                    // console.log('confirmation', confirmationNumber);
                })
                .on('receipt', function(receipt) {
                    console.log("receipt:\n" + receipt);
                    //resolve(receipt)
                })
                .on('error', function(err) {
                    console.log("err:\n" + err);
                    //reject(err);
                })
        })
        // var result = web3.eth.call({
        //     to: "0x6B4e27bC0cA0517fB1164e6A9B5931E0B5De25ba",
        //     data: "0x" + "b5cb15f7"
        // });

    // console.log(result);
}