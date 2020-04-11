var Web3 = require('web3');
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
    console.log("321")
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/96849b65e61e49acb2b3d396c97e0c37"));
    console.log("123");
    const ContractCareRecordJSON = require('../build/contracts/CareRecordConsent.json');

    const contractAddr = '0xa8954d95d89c7fb411fC3BEf8E90F9c1bb4AAAED';
    //const RegistryContract = new web3.eth.Contract(RegistryContractJSON.abi, contractAddr);
    const CareRecordContract = new web3.eth.Contract(ContractCareRecordJSON.abi, contractAddr);

    const privateKey = '213AACA6034A6629A4FFCBFE1FC12811A43C296CC99C766F8D61FAED281ACF50';
    const userAccount = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
    const userAddr = userAccount.address;
    var Tx = require('ethereumjs-tx').Transaction;
    //console.log(txdata)
    var tdata = web3.utils.keccak256('a')
    var sdata = web3.utils.keccak256('a')
    CareRecordContract.methods.isAuth('NTUHH', tdata, 1, 1, sdata, 20190331).call({
            from: '0xAc66E1BE03223e4CCAc17b1260f05EB925c4812D'
        })
        .then(console.log);
}