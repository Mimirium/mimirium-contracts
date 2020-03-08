const NodeRegister = artifacts.require("./NodeRegister.sol");
const CompanyRegister = artifacts.require("./CompanyRegister.sol");
const CampaignRegister = artifacts.require("./CampaignRegister.sol");
const DataGeneratorRegister = artifacts.require("./DataGeneratorRegister.sol");
const ContractConfig = require("../js/ContractConfig.js");

module.exports = function(deployer, network) {
    deployer
        .deploy(NodeRegister)
        .then((node) => {
            ContractConfig.addContract(network, "NodeRegister", node.address, node.abi);
            return deployer.deploy(CompanyRegister)
        })
        .then((company) => {
            ContractConfig.addContract(network, "CompanyRegister", company.address, company.abi);
            return deployer.deploy(CampaignRegister, company.address)
        })
        .then((campaign) => {
            ContractConfig.addContract(network, "CampaignRegister", campaign.address, campaign.abi);
            return deployer.deploy(DataGeneratorRegister)
        })
        .then((generator) => {
            ContractConfig.addContract(network, "DataGeneratorRegister", generator.address, generator.abi);
        })
};
