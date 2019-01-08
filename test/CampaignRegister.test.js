const assertThrows = require("./utils/assertThrows.js");
const CompanyRegister = artifacts.require('./CompanyRegister.sol')
const CampaignRegister = artifacts.require('./CampaignRegister.sol')

contract('CampaignRegsiter', function (accounts) {

    const [
        owner,
        user1
    ] = accounts;

    const DataTypes = {
        Survey: 0,
        DataMining: 1, 
        FederatedLearning: 2
    }

    let realNow = Math.floor(Date.now() / 1000) + 60*60; // one hour ahead of time
    let now = realNow;
    const oneDay = 60*60*24; // 60 sec x 60 min x 24 hours
    const multihash = "QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC";

    let campaigns;
    let companies;
    let companyId;

    before(async () => {
        companies = await CompanyRegister.new();
        campaigns = await CampaignRegister.new(companies.address);
    })

    describe("Initialization", function () {

        it("initializes properly", async () => {
            assert.isNotNull(companies);
            assert.isNotNull(campaigns);
        })

        it("company can be added", async () => {
            let tx = await companies.registerCompany(multihash, "Mimirium Ltd");
            assert.equal(tx.logs[0].event, "CompanyRegistered");
            let list = await companies.getCompaniesList();
            assert.isNotEmpty(list);
            companyId = list[0];
        })
    })

    describe("Creating Campaigns", function () {

        it("owner can create campaign with correct data", async () => {
            let tx = await campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now, now + oneDay, {from: owner, value: web3.toWei(1, "ether")});
            assert.equal(tx.logs[0].event, "CampaignCreated");
        })

        it("non-owner can NOT create campaign with correct data", async () => {
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now, now + oneDay, {from: user1, value: web3.toWei(1, "ether")}));
        })

        it("owner can NOT create campaign without budget", async () => {
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now, now + oneDay, {from: owner, value: 0}));
        })

        it("owner can NOT create campaign with incorrect timing", async () => {
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now, now - oneDay, {from: owner, value: web3.toWei(1, "ether")}));
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now - oneDay, now + oneDay, {from: owner, value: web3.toWei(1, "ether")}));
        })

        it("owner can NOT create campaign from non-existing company", async () => {
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, 0x00000000000000000000, 0, 10, now, now + oneDay, {from: owner, value: web3.toWei(1, "ether")}));
        })
    })

    describe("Listing", function () {

        let campaignsList;

        it("campaign list can be retrieved", async () => {
            campaignsList = await campaigns.getCampaignsList();
            assert.isArray(campaignsList);
            assert.isNotEmpty(campaignsList);
        })

        it("campaign data can be retrieved", async () => {
            let campaign = await campaigns.getCampaign(campaignsList[0]);
            assert.isArray(campaign);
            assert.isNotNull(campaign[0]);                      // id
            assert.isNotNull(campaign[1]);                      // multihash
            assert.equal(campaign[2], DataTypes.Survey);        // dataType
            assert.equal(campaign[3], companyId);               // company
            assert.equal(campaign[4], 0);                       // minRespondents
            assert.equal(campaign[5], 10);                      // maxRespondends
            assert.equal(campaign[6], web3.toWei(1, "ether"));  // budget
            assert.equal(campaign[7], now);                     // startTime
            assert.equal(campaign[8], now + oneDay);            // endTime
        })
    })
})