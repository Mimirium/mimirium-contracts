const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const CompanyRegister = artifacts.require('./CompanyRegister.sol')
const isBN = web3.utils.isBN;

contract('CompanyRegister', function (accounts) {

    const [
        OWNER,
        USER1
    ] = accounts;

    const MULTIHASH = "QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC";

    let register;

    before(async () => {
        register = await CompanyRegister.new();
        assert.isNotNull(register);
    })

    describe("Registering", function () {

        it("owner can register company", async () => {
            let tx = await register.registerCompany(MULTIHASH, "Test Company1", {from: OWNER});
            assertEvent(tx, "CompanyRegistered", (args) => {
                assert.isNotEmpty(args.id);
                assert(args.multihash == MULTIHASH, "multihash is not correct");
                assert(args.name == "Test Company1", "name is not correct");
                assert(args.createdTime.toNumber() > 0, "createdTime is not correct");
            });
        })

        it("non-owner can NOT register a company", async () => {
            let sender = USER1;
            await assertFail(register.registerCompany(MULTIHASH, "Test Company2", {from: sender}));
        })
    })

    describe("Listing", function () {

        let companiesList;

        it("companies list can be retrieved", async () => {
            companiesList = await register.getCompaniesList();
            assert.isNotEmpty(companiesList);
        })

        it("company retrieved should exist", async () => {
            let exists = await register.companyExists(companiesList[0]);
            assert.isTrue(exists);
        })

        it("company data can be retrieved", async () => {
            let company = await register.getCompany(companiesList[0]);
            assert.hasAllKeys(company, ["0","1","2","3","4","5","6"], "Incorrect struct returned");
            assert.isNotEmpty(company["0"], "Incorrect id");
            assert.equal(company["1"], MULTIHASH, "Incorrect multihash");
            assert.equal(company["2"], "Test Company1", "Incorrect name");
            assert(isBN(company["3"]), "Incorrect balance");
            assert(isBN(company["4"]) && company["4"].gt(0), "Incorrect createdTime");
            assert(isBN(company["5"]), "Incorrect lastCampaignTime");      
            assert(isBN(company["6"]), "Incorrect spent");
        })
    })
})