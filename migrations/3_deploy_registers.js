var NodeRegister = artifacts.require("./NodeRegister.sol");
var CompanyRegister = artifacts.require("./CompanyRegister.sol");
var CampaignRegsiter = artifacts.require("./CampaignRegister.sol");
/*var fs = require('fs');

saveJson = function (network, contractData) {
    let filename = "./release/" + network + ".json";
    let jsonData = JSON.stringify(contractData, null, "\t");
    fs.writeFile(filename, jsonData, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}*/

module.exports = function (deployer, network) {
    deployer
        .deploy(NodeRegister)
        .then((node) => {
            deployer.deploy(CompanyRegister)
        })
        .then((company) => {
            deployer.deploy(CampaignRegsiter, company)
        })
};
