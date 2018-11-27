var NodeRegister = artifacts.require("./NodeRegister.sol");
var CompanyRegsiter = artifacts.require("./CompanyRegsiter.sol");
var CampaignRegsiter = artifacts.require("./CampaignRegsiter.sol");
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
            deployer.deploy(CompanyRegsiter)
        })
        .then((company) => {
            deployer.deploy(CampaignRegsiter, company)
        })
};
