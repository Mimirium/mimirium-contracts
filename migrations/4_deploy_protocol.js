const ProtocolRegister = artifacts.require("./ProtocolRegister.sol");
const ContractConfig = require("../js/ContractConfig.js");

module.exports = async function(deployer, network) {
    deployer
        .deploy(ProtocolRegister)
        .then(async (protocol) => {
            data = ContractConfig.getProtocol(network);
            await protocol.registerProtocol(data.description, data.addresses);
            ContractConfig.addContract(network, "ProtocolRegister", protocol.address, protocol.abi);
        })
};