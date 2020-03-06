const MimiriumToken = artifacts.require('./MimiriumToken.sol');
const MimiriumExchange = artifacts.require('./MimiriumExchange.sol');
const NodeRegister = artifacts.require("./NodeRegister.sol");
const CompanyRegister = artifacts.require("./CompanyRegister.sol");
const CampaignRegister = artifacts.require("./CampaignRegister.sol");
const DataGeneratorRegister = artifacts.require("./DataGeneratorRegister.sol");

class DummyData {

    static async populate() {
        let accounts = await web3.eth.getAccounts();
        let owner = accounts[0];
        let user1 = accounts[1];

        // Add dummy companies
        console.log("Registering companies:");
        let company = await CompanyRegister.deployed();

        await company.registerCompany("QmbjjSvDULEtqWGyb3FaZAZdnX6nCFeJZ1GgQ1Vw2DUv1c", "Mimirium Ltd");
        await company.registerCompany("Qmd4kbMJnDxhrHp7aeYU8pdfHWHPDo8FQ5K1UPbWxzVFBB", "BonArt Ltd");
        let clist = await company.getCompaniesList();
        console.log(clist);

        // Add aggregation nodes
        console.log("Registering aggregation nodes:");
        let node1 = accounts[5];
        let node2 = accounts[6];
        let nodes = await NodeRegister.deployed();        

        await nodes.registerNode(node1, "AggNode1", "172.105.72.226");
        //await nodes.activateNode({from: node1, value: web3.toWei(2, 'ether')});
        await nodes.activateNode({from: node1});

        await nodes.registerNode(node2, "AggNode2", "172.104.247.141");
        //await nodes.activateNode({from: node2, value: web3.toWei(1, 'ether')});
        await nodes.activateNode({from: node2});

        let nlist = await nodes.getNodesList();
        console.log(nlist);

        // Add data generators (GPs)
        console.log("Registering GPs:");
        let dataGenerator = await DataGeneratorRegister.deployed();

        await dataGenerator.registerDataGenerator("QmRLhNCVyM8YBZCBCN59V3h64f3rd6FxU58AcmJdgZDq9Y", "d.kalchev@abv.bg");
        await dataGenerator.registerDataGenerator("QmbPoL89vF8tVU74odEgGjRgbDLdeRKGEmLFXm4hjENSDs", "c.varbanov@abv.bg");
        await dataGenerator.registerDataGenerator("QmbPBUCRsXQwuaTK5C5o3NBWdvnyqg5sob9aeyfp3C1E3L", "k.mihailova@abv.bg");
        await dataGenerator.registerDataGenerator("QmWZoZYQk2TwnSehXDXM4S3N2RCFeB9Vhnos6YYZiirGer", "n.kaneva@abv.bg");
        await dataGenerator.registerDataGenerator("QmUQAsSk1Ad7oCzkvSn8UvJP3SakXFUnwguXEYpaFUza3e", "a.kisheva@abv.bg");
        await dataGenerator.registerDataGenerator("QmaPdCZDuk1zaEqYKH9sBnNUYdfU2CXcsAmFcdMeiCBdtb", "d.lyutskanova@abv.bg");
        await dataGenerator.registerDataGenerator("QmVC9ZA6PP98Aw7F863s42YQsJuqcbRrT4RVisBpTXfkHE", "m.kuneva@abv.bg");
        await dataGenerator.registerDataGenerator("QmUfK2G6w1E2xY2t2VMPPti9CiNFSSMgtPhjSgAdgLyoQx", "r.gigov@abv.bg");
        let dgList = await dataGenerator.getDataGeneratorsList();
        console.log(dgList);

        // Add campaigns
        console.log("Registering campaigns");
        let startDate = "1575183993";
        let endDate = "1577826000";
        let budget = web3.utils.toWei("1", "ether");

        let campaigns = await CampaignRegister.deployed();    
        let id1 = await campaigns.createCampaign(
            "QmYEEsQA63aTQYjwVeaib5abF8FvusRiYwMq6MVeA9JXRw", 
            "1",
            clist[0],
            "0",
            "1000",
            budget,
            startDate,
            endDate,
            {from: owner}
        );
        let id2 = await campaigns.createCampaign(
            "QmeV3RgdWV5qmG7HTob12gkm3UvonktXUdfJkxMB5S3Lvt", 
            "1",
            clist[0],
            "0",
            "1000",
            budget,
            startDate,
            endDate,
            {from: owner}
        );
        let id3 = await campaigns.createCampaign(
            "QmVU9PE2jaujNWAYijfz4yDLTfCFA18rf9LbCNwqtkW2qu", 
            "1",
            clist[0],
            "0",
            "1000",
            budget,
            startDate,
            endDate,
            {from: owner}
        );
        let id4 = await campaigns.createCampaign(
            "QmdQVq6SiVo2j7zJXsczjxvCw3Qo7EEoVwmMHb4z1meWSb", 
            "1",
            clist[0],
            "0",
            "1000",
            budget,
            startDate,
            endDate,
            {from: owner}
        );

        let calist = await campaigns.getCampaignsList();
        console.log(calist);
    }
}

module.exports = async (callback) => {
    await DummyData.populate();
    callback();
}