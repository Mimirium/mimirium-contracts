const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const DataGeneratorRegister = artifacts.require('./DataGeneratorRegister.sol')
const isBN = web3.utils.isBN;

contract('DataGeneratorRegister', function (accounts) {

    const [
        OWNER,
        USER1
    ] = accounts;

    const MULTIHASH = "QmVcSqVEsvm5RR9mBLjwpb2XjFVn5bPdPL69mL8PH45pPC";

    let register;

    before(async () => {
        register = await DataGeneratorRegister.new();
        assert.isNotNull(register);
    })

    describe("Registering", function () {

        it("owner can register data generator", async () => {
            let tx = await register.registerDataGenerator(MULTIHASH, "Test Clinic", {from: OWNER});
            assertEvent(tx, "DataGeneratorRegistered", (args) => {
                assert.isNotEmpty(args.id);
                assert(args.multihash == MULTIHASH, "multihash is not correct");
                assert(args.name == "Test Clinic", "name is not correct");
                assert(args.createdTime.toNumber() > 0, "createdTime is not correct");
            });
        })

        it("non-owner can NOT register a data generator", async () => {
            let sender = USER1;
            await assertFail(register.registerDataGenerator(MULTIHASH, "Test Clinic2", {from: sender}));
        })
    })

    describe("Listing", function () {

        let dataGeneratorsList;

        it("data generators list can be retrieved", async () => {
            dataGeneratorsList = await register.getDataGeneratorsList();
            assert.isNotEmpty(dataGeneratorsList);
        })

        it("data generator retrieved should exist", async () => {
            let exists = await register.dataGeneratorExists(dataGeneratorsList[0]);
            assert.isTrue(exists);
        })

        it("data generator data can be retrieved", async () => {
            let company = await register.getDataGenerator(dataGeneratorsList[0]);
            assert.hasAllKeys(company, ["0","1","2","3","4","5","6"], "Incorrect struct returned");
            assert.isNotEmpty(company["0"], "Incorrect id");
            assert.equal(company["1"], MULTIHASH, "Incorrect multihash");
            assert.equal(company["2"], "Test Clinic", "Incorrect name");
            assert(isBN(company["3"]), "Incorrect balance");
            assert(isBN(company["4"]) && company["4"].gt(0), "Incorrect createdTime");
            assert(isBN(company["5"]), "Incorrect lastCampaignTime");      
            assert(isBN(company["6"]), "Incorrect spent");
        })
    })
})