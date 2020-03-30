const Registry = artifacts.require('RegistryContract');

module.exports = function(deployer) {
    deployer.deploy(Registry);
};