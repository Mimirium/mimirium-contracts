const MimiriumToken = artifacts.require('./MimiriumToken.sol');
const MimiriumExchange = artifacts.require('./MimiriumExchange.sol');
const NodeRegister = artifacts.require("./NodeRegister.sol");
const CompanyRegister = artifacts.require("./CompanyRegister.sol");
const CampaignRegister = artifacts.require("./CampaignRegister.sol");

class DummyData {
    static owner = web3.eth.accounts[0];
    static user1 = web3.eth.accounts[1];
    static node1 = web3.eth.accounts[2];
    static node2 = web3.eth.accounts[3];
    static node3 = web3.eth.accounts[4];

    async _init() {
        this.token = await MimiriumToken.deployed();
        this.exchange = await MimiriumExchange.deployed();
        this.node = await NodeRegister.deployed();
        this.company = await CompanyRegister.deployed();
        this.campaign = await CampaignRegister.deployed();
    }

    static async populate() {
        await DummyData._populateCompanies();
    }

    static async _populateCompanies() {
        let company = await CompanyRegister.deployed();
        await company.registerCompany("Mimirium Ltd");
        await company.registerCompany("Eurostat");
        await company.registerCompany("Nielsen");
        await company.registerCompany("Google Inc");
    }

    static async _populateNodes() {
        let node = await NodeRegister.deployed();

        await node.whitelistNode(node1);
        await company.registerNode("Galin", "http://192.168.0.107", {from: node1, value: web3.toWei(10, 'ether')});

        await node.whitelistNode(node2);
        await company.registerNode("Galin", "http://192.168.0.107");
    }
}

module.exports = async (callback) => {
    await DummyData.populate();
    callback();
}