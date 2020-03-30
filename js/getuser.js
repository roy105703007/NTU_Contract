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

    //var txdata = RegistryContract.methods.getUserInfo('A1012').encodeABI()
    var Tx = require('ethereumjs-tx').Transaction;
    //console.log(txdata)
    RegistryContract.methods.getUserInfo('A130519512').call({
            from: '0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D'
        })
        .then(console.log);
}