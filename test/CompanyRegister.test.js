const assertThrows = require("./utils/assertThrows.js");
const CompanyRegister = artifacts.require('./CompanyRegister.sol')

contract('CompanyRegister', function (accounts) {

    const [
        owner,
        node1,
        node2,
        user1
    ] = accounts;

    let register;

    before(async () => {
        register = await CompanyRegister.new();
    })

    describe("Registering", function () {

        it("owner can can register company", async () => {
            let tx = await register.registerCompany("Test Company1", {from: owner});
            assert.equal(tx.logs[0].event, "CompanyRegistered");
        })

        it("non-owner node can NOT register a company", async () => {
            await assertThrows(register.registerCompany("Test Company2", {from: node2}));
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
            assert.isNotNull(company[0]);
            assert.equal(company[1], "Test Company1");
            assert.isNotNull(company[2]);
            assert.isNotNull(company[3]);
            assert.isNotNull(company[4]);
            assert.isNotNull(company[5]);
        })
    })
})