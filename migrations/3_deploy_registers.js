const NodeRegister = artifacts.require("./NodeRegister.sol");
const CompanyRegister = artifacts.require("./CompanyRegister.sol");
const CampaignRegister = artifacts.require("./CampaignRegister.sol");
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
        })
};
