const assertThrows = require("./utils/assertThrows.js");
const CompanyRegister = artifacts.require('./CompanyRegister.sol')
const CampaignRegister = artifacts.require('./CampaignRegister.sol')

contract('CampaignRegsiter', function (accounts) {

    const [
        owner,
        user1
    ] = accounts;

    const now = Math.floor(Date.now() / 1000) + 60*60; // one hour ahead of time
    const oneDay = 60*60*24; // 60 sec x 60 min x 24 hours

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
            let tx = await companies.registerCompany("Mimirium Ltd");
            assert.equal(tx.logs[0].event, "CompanyRegistered");
            let list = await companies.getCompaniesList();
            assert.isNotEmpty(list);
            companyId = list[0];
        })
    })

    describe("Creating Campaigns", function () {

        it("owner can create campaign with correct data", async () => {
            let tx = await campaigns.createCampaign(companyId, 0, 10, now, now + oneDay, {from: owner, value: web3.toWei(1, "ether")});
            assert.equal(tx.logs[0].event, "CampaignCreated");
        })

        it("non-owner can NOT create campaign with correct data", async () => {
            await assertThrows(campaigns.createCampaign(companyId, 0, 10, now, now + oneDay, {from: user1, value: web3.toWei(1, "ether")}));
        })

        it("owner can NOT create campaign without budget", async () => {
            await assertThrows(campaigns.createCampaign(companyId, 0, 10, now, now + oneDay, {from: owner, value: 0}));
        })

        it("owner can NOT create campaign with incorrect timing", async () => {
            await assertThrows(campaigns.createCampaign(companyId, 0, 10, now, now - oneDay, {from: owner, value: web3.toWei(1, "ether")}));
            await assertThrows(campaigns.createCampaign(companyId, 0, 10, now - oneDay, now + oneDay, {from: owner, value: web3.toWei(1, "ether")}));
        })

        it("owner can NOT create campaign from non-existing company", async () => {
            await assertThrows(campaigns.createCampaign(0x00000000000000000000, 0, 10, now, now + oneDay, {from: owner, value: web3.toWei(1, "ether")}));
        })
    })

    describe("Listing", function () {

        let campaignsList;

        it("campaign list can be retrieved", async () => {
            campaignsList = await campaigns.getCampaignsList();
            assert.isNotEmpty(campaignsList);
        })

        it("campaign data can be retrieved", async () => {
            let campaign = await campaigns.getCampaign(campaignsList[0]);
            assert.isNotNull(campaign[0]);
            assert.equal(campaign[1], companyId);
            assert.equal(campaign[2], 0);
            assert.equal(campaign[3], 10);
            assert.equal(campaign[4], web3.toWei(1, "ether"));
            assert.equal(campaign[5], now);
            assert.equal(campaign[6], now + oneDay);
        })
    })
})