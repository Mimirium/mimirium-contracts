const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const CompanyRegister = artifacts.require("./CompanyRegister.sol")
const CampaignRegister = artifacts.require("./CampaignRegister.sol")

contract('CampaignRegister', function (accounts) {

    const [
        OWNER,
        USER1
    ] = accounts;

    const DataTypes = {
        Survey: 0,
        DataMining: 1, 
        FederatedLearning: 2
    }

    const ONE_ETHER = web3.utils.toWei("1", "ether");
    const NOW = Math.floor(Date.now() / 1000) + 60*60; // one hour ahead of time
    const ONE_DAY = 60*60*24; // 60 sec x 60 min x 24 hours
    const MULTIHASH = "QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC";

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
            let tx = await companies.registerCompany(MULTIHASH, "Mimirium Ltd");
            assertEvent(tx, "CompanyRegistered", (args) => {
                assert.isNotEmpty(args.id);
                assert(args.multihash == MULTIHASH, "multihash is not correct");
                assert(args.name == "Mimirium Ltd", "name is not correct");
                assert(args.createdTime.toNumber() > 0, "createdTime is not correct");
            });

            let list = await companies.getCompaniesList();
            assert.isNotEmpty(list);
            companyId = list[0];
        })
    })

    describe("Creating Campaigns", function () {

        it("owner can create campaign with correct data", async () => {
            let tx = await campaigns.createCampaign(MULTIHASH, DataTypes.Survey, companyId, 0, 10, NOW, NOW + ONE_DAY, {from: OWNER, value: ONE_ETHER});
            assertEvent(tx, "CampaignCreated", (args) => {
                assert.isNotEmpty(args.id);
                console.log(args.multihash.toString());
                assert(args.multihash.toString() == MULTIHASH, "multihash is not correct");
                assert(args.dataType, DataTypes.Survey);
                assert(args.company == companyId, "company is not registered");
                assert(args.minRespondents.toNumber() == 0, "minRespondents is incorrect");
                assert(args.maxRespondents.toNumber() == 10, "maxRespondents is incorrect");
                assert(args.budget.toString() == ONE_ETHER, "budget is incorrect");
                assert(args.startTime.toNumber() == NOW, "startTime is incorrect");
                assert(args.endTime.toNumber() == NOW + ONE_DAY, "endTime is incorrect");
            });
            assert.equal(tx.logs[0].event, "CampaignCreated");
        })

        it("non-owner can NOT create campaign with correct data", async () => {
            await assertFail(campaigns.createCampaign(MULTIHASH, DataTypes.Survey, companyId, 0, 10, NOW, NOW + ONE_DAY, {from: USER1, value: ONE_ETHER}));
        })

        /*it("owner can NOT create campaign without budget", async () => {
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now, now + oneDay, {from: owner, value: 0}));
        })

        it("owner can NOT create campaign with incorrect timing", async () => {
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now, now - oneDay, {from: owner, value: web3.utils.toWei("1", "ether")}));
            await assertThrows(campaigns.createCampaign(multihash, DataTypes.Survey, companyId, 0, 10, now - oneDay, now + oneDay, {from: owner, value: web3.utils.toWei("1", "ether")}));
        })

        it("owner can NOT create campaign from non-existing company", async () => {
            const nonExistingCompany = "0x00000000000000000000000000000000";
            try {
                await campaigns.createCampaign(multihash, DataTypes.Survey, nonExistingCompany, 0, 10, now, now + oneDay, {from: owner, value: web3.utils.toWei("1", "ether")});
            } catch(err) {
                assert(err.reason == "This company is not registered");
            }
        })*/
    })

    /*describe("Listing", function () {

        let campaignsList;

        it("campaign list can be retrieved", async () => {
            campaignsList = await campaigns.getCampaignsList();
            assert.isArray(campaignsList);
            assert.isNotEmpty(campaignsList);
        })

        it("campaign data can be retrieved", async () => {
            let campaign = await campaigns.getCampaign(campaignsList[0]);
            console.log(campaign);
            return;
            assert.isArray(campaign);
            assert.isNotNull(campaign[0]);                      // id
            assert.isNotNull(campaign[1]);                      // multihash
            assert.equal(campaign[2], DataTypes.Survey);        // dataType
            assert.equal(campaign[3], companyId);               // company
            assert.equal(campaign[4], 0);                       // minRespondents
            assert.equal(campaign[5], 10);                      // maxRespondends
            assert.equal(campaign[6], web3.utils.toWei("1", "ether"));  // budget
            assert.equal(campaign[7], now);                     // startTime
            assert.equal(campaign[8], now + oneDay);            // endTime
        })
    })*/
})