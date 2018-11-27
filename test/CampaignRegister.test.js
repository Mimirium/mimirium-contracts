const assertThrows = require("./utils/assertThrows.js");
const CampaignRegsiter = artifacts.require('./CampaignRegsiter.sol')

contract('CampaignRegsiter', function (accounts) {

    const [
        owner,
        user1
    ] = accounts;

    let campaigns;
    let companies;

    before(async () => {
        campaigns = await CampaignRegsiter.new();            
        companies = await 
    })

    describe("Creating Campaigns", function () {

        it("owner can create campaign with correct data", async () => {
            camapaigns.createCampaign();
            address company, 
        uint256 minRespondents, 
        uint256 maxRespondents, 
        uint256 startTime, 
        uint256 endTime) 
        })

        it("non-owner can NOT create campaign with correct data", async () => {
        })

        it("non-owner can NOT create campaign without budget", async () => {
        })

        it("non-owner can NOT create campaign with incorrect timing", async () => {
        })

        it("owner can NOT create campaign with incorrect data", async () => {
        })
    })

    describe("Listing", function () {

        let campaignsList;

        it("campaign list can be retrieved", async () => {
            campaignsList = await register.getCampaignsList();
            assert.isNotEmpty(campaignsList);
        })

        it("campaign data can be retrieved", async () => {
            console.log(campaignsList[0]);
            let campaign = await register.getCampaign(campaignsList[0]);
            //assert(node[0], node1);
            //assert(node[1], "Test Node1");
            //assert(node[2], "http://testurl.com/");
        })
    })
})