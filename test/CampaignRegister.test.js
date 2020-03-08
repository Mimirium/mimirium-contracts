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

    const ONE_ETHER = web3.utils.toWei(web3.utils.toBN(1), "ether");
    const NOW = Math.floor(Date.now() / 1000) + 60*60; // one hour ahead of time
    const ONE_DAY = 60*60*24; // 60 sec x 60 min x 24 hours
    const MULTIHASH = "QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC";

    let campaigns;
    let companies;
    let companyId;

    before(async () => {
        companies = await CompanyRegister.new();
        assert.isNotNull(companies);
        campaigns = await CampaignRegister.new(companies.address);
        assert.isNotNull(campaigns);
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

        it("OWNER can create campaign with correct data", async () => {
            let tx = await campaigns.createCampaign(
                MULTIHASH,              // Hash in IPFS
                DataTypes.Survey,       // Type of the campaign - survey, data mining etc.
                companyId,              // Id of the company ordering the campaign
                0,                      // Minimum participants
                10,                     // Maximum participants
                ONE_ETHER,              // Budget
                NOW,                    // Starting time of the campaign
                NOW + ONE_DAY,          // Deadline of the campaign
                {
                    from: OWNER,        // Must be created by the contact's OWNER
                    value: ONE_ETHER    // The total budget of the campaign
                });
            assertEvent(tx, "CampaignCreated", (args) => {
                assert.isNotEmpty(args.id);
                assert(args.multihash.toString() == MULTIHASH, "multihash is not correct");
                assert(args.dataType, DataTypes.Survey, "dataType is not correct");
                assert(args.company == companyId, "company is not registered");
                assert(args.minRespondents.toNumber() == 0, "minRespondents is incorrect");
                assert(args.maxRespondents.toNumber() == 10, "maxRespondents is incorrect");
                assert(args.budget.eq(ONE_ETHER), "budget is incorrect");
                assert(args.startTime.toNumber() == NOW, "startTime is incorrect");
                assert(args.endTime.toNumber() == NOW + ONE_DAY, "endTime is incorrect");
            });
        })

        it("non-owner can NOT create campaign with correct data", async () => {
            let sender = USER1; // non-owner
            await assertFail(
                campaigns.createCampaign(MULTIHASH, DataTypes.Survey, companyId, 0, 10, ONE_ETHER, NOW, NOW + ONE_DAY, {from: sender, value: ONE_ETHER})
            );
        })

        it("owner can NOT create campaign without budget", async () => {
            let budget = 0;
            await assertFail(
                campaigns.createCampaign(MULTIHASH, DataTypes.Survey, companyId, 0, 10, budget, NOW, NOW + ONE_DAY, {from: OWNER, value: budget}),
                "Give some cash"
            );
        })

        it("owner can NOT create campaign with incorrect timing", async () => {
            let startTime = NOW;
            let endTime = NOW - ONE_DAY; // Deadline is before start time
            await assertFail(
                campaigns.createCampaign(MULTIHASH, DataTypes.Survey, companyId, 0, 10, ONE_ETHER, startTime, endTime, {from: OWNER, value: ONE_ETHER}),
                "endTime must be after startTime");
            startTime = NOW - ONE_DAY; // Start time is in the past
            endTime = NOW + ONE_DAY; 
            await assertFail(
                campaigns.createCampaign(MULTIHASH, DataTypes.Survey, companyId, 0, 10, ONE_ETHER, startTime, endTime, {from: OWNER, value: ONE_ETHER}),
                "Campaigns cannot be in the past"
            );
        })

        it("owner can NOT create campaign from non-existing company", async () => {
            const nonExistingCompany = "0x00000000000000000000000000000000";
            await assertFail(
                campaigns.createCampaign(MULTIHASH, DataTypes.Survey, nonExistingCompany, 0, 10, ONE_ETHER, NOW, NOW + ONE_DAY, {from: OWNER, value: ONE_ETHER}),
                "company is not registered"
            );
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
            assert.hasAllKeys(campaign, ["0","1","2","3","4","5","6","7","8"], "Incorrect struct returned");
            assert.isNotEmpty(campaign["0"], "Incorrect id");               
            assert.isNotNull(campaign["1"], "Incorrect multihash");                
            assert.equal(campaign["2"], DataTypes.Survey, "Incorrect dataType");   
            assert.equal(campaign["3"], companyId, "Incorrect companyId");           
            assert.equal(campaign["4"], 0, "Incorrect minRespondents");                  
            assert.equal(campaign["5"], 10, "Incorrect maxRespondends");            
            assert(campaign["6"].eq(ONE_ETHER), "Incorrect budget");         
            assert.equal(campaign["7"], NOW, "Incorrect startTime");            
            assert.equal(campaign["8"], NOW + ONE_DAY, "Incorrect endTime");      
        })
    })
})