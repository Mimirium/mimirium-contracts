const MimiriumToken = artifacts.require('./MimiriumToken.sol');
const MimiriumExchange = artifacts.require('./MimiriumExchange.sol');
const NodeRegister = artifacts.require("./NodeRegister.sol");
const CompanyRegister = artifacts.require("./CompanyRegister.sol");
const CampaignRegister = artifacts.require("./CampaignRegister.sol");

class DummyData {

    static async populate() {
        let owner = web3.eth.accounts[0];
        let user1 = web3.eth.accounts[1];
        const multihash = "QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC";

        // Add dummy companies
        console.log("Registering companies:");
        let company = await CompanyRegister.deployed();

        await company.registerCompany(multihash, "Mimirium Ltd");
        await company.registerCompany(multihash, "Eurostat");
        await company.registerCompany(multihash, "Nielsen");
        await company.registerCompany(multihash, "Google Inc");
        let clist = await company.getCompaniesList();
        console.log(clist);

        // Add aggregation nodes
        console.log("Registering aggregation nodes:");
        let node1 = web3.eth.accounts[2];
        let node2 = web3.eth.accounts[3];
        let node3 = web3.eth.accounts[4];
        let nodes = await NodeRegister.deployed();        

        await nodes.registerNode(node1, "Linode", "172.104.247.141");
        await nodes.activateNode({from: node1, value: web3.toWei(10, 'ether')});

        await nodes.registerNode(node2, "Kiril", "http://192.168.0.104");
        await nodes.activateNode({from: node2, value: web3.toWei(10, 'ether')});

        await nodes.registerNode(node3, "Vasil", "http://192.168.0.115");
        await nodes.activateNode({from: node3, value: web3.toWei(10, 'ether')});

        let nlist = await nodes.getNodesList();
        console.log(nlist);

        // Add campaigns
        console.log("Registering campaigns");
        let now = Math.floor((new Date()).getTime() / 1000);
        let oneDay = 60*60*24; // 60 sec x 60 min x 24 hours

        let campaigns = await CampaignRegister.deployed();    
        let id = await campaigns.createCampaign(
            multihash, 
            0,
            clist[0],
            0,
            10,
            now + 60,
            now + oneDay,
            {from: owner, value: web3.toWei(1, 'ether')}
        );
        let calist = await campaigns.getCampaignsList();
        console.log(calist);
    }
}

module.exports = async (callback) => {
    await DummyData.populate();
    callback();
}