var Web3 = require('web3');


if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("321")
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/96849b65e61e49acb2b3d396c97e0c37"));
    console.log("123");
    var Tx = require('ethereumjs-tx').Transaction;
    //var privateKey = new Buffer('213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50', 'hex')
    web3.eth.getTransactionCount('0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D', "pending").then(function(nonce) {

            var rawTx = {
                nonce: Web3.utils.toHex(nonce),
                gasPrice: Web3.utils.toHex(10),
                gasLimit: Web3.utils.toHex(3000000),
                to: '0x6940E17d756c89F8Da0649B399940F9891340d13',
                value: '0x00',
                data: '0x59e26be1000000000000000000000000ac66e1be03223e4ccac17b1260f05eb925c4812d'
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
// {
//     "59e26be1": "addWitness(address)",
//     "8441f89e": "deleteWitness(address)",
//     "893d20e8": "getOwner()",
//     "b5cb15f7": "getUserCount()",
//     "7c9b7fdd": "getUserInfo(string)",
//     "96d195bd": "getWitnesses()",
//     "8da5cb5b": "owner()",
//     "4b512eaa": "registerUser(string,address,address)",
//     "fb14f771": "setAccountStatus(string,uint256)",
//     "a80ba7bf": "setCareRecordConsentAddr(string,address)",
//     "9f9b2da9": "setEthAddr(string,address)",
//     "b91fddf3": "setOldUser(string,address,uint256,address,address,uint256)",
//     "5a14b678": "setWitness(string,address)"
//    }


// var privatekey = "213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50"

// const Tx = require('ethereumjs-tx').Transaction
// const privateKey = new Buffer.from(privatekey, 'hex');

// var rawTx = {
//     nonce: '0x00',
//     gasPrice: '0x09184e72a000',
//     gasLimit: '0x2710',
//     to: '0x6B4e27bC0cA0517fB1164e6A9B5931E0B5De25ba',
//     value: '0x00',
//     data: '0x' + '59e26be1' + '0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D'
// }

// // The second parameter is not necessary if these values are used
// var tx = new Tx(rawTx);
// tx.sign(privateKey)
// var serializedTx = tx.serialize()
// web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
//     if (!err)
//         console.log(hash);
//     else
//         console.log(err)
// });