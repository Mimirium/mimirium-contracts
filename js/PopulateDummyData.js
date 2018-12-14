const MimiriumToken = artifacts.require('./MimiriumToken.sol');
const MimiriumExchange = artifacts.require('./MimiriumExchange.sol');
const NodeRegister = artifacts.require("./NodeRegister.sol");
const CompanyRegister = artifacts.require("./CompanyRegister.sol");
const CampaignRegister = artifacts.require("./CampaignRegister.sol");

class DummyData {

    static async populate() {
        await DummyData._populateCompanies();
        await DummyData._populateNodes();
    }

    static async _populateCompanies() {
        let company = await CompanyRegister.deployed();
        await company.registerCompany("Mimirium Ltd");
        await company.registerCompany("Eurostat");
        await company.registerCompany("Nielsen");
        await company.registerCompany("Google Inc");
    }

    static async _populateNodes() {
        let node1 = web3.eth.accounts[2];
        let node2 = web3.eth.accounts[3];
        let node3 = web3.eth.accounts[4];
        let register = await NodeRegister.deployed();

        await register.registerNode(node1, "Galin", "http://192.168.0.107");
        await register.activateNode({from: node1, value: web3.toWei(10, 'ether')});

        await register.registerNode(node2, "Kiril", "http://192.168.0.104");
        await register.activateNode({from: node2, value: web3.toWei(10, 'ether')});

        await register.registerNode(node3, "Vasil", "http://192.168.0.115");
        await register.activateNode({from: node3, value: web3.toWei(10, 'ether')});
    }
}

module.exports = async (callback) => {
    await DummyData.populate();
    callback();
}