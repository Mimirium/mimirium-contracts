const assertThrows = require("./utils/assertThrows.js");
const ProtocolRegister = artifacts.require('./ProtocolRegister.sol')

contract('ProtocolRegister', function (accounts) {

    const [
        owner,
        user1
    ] = accounts;

    const protocol = [
        "0x92d66a311a2314ca5402f51423e70f4f223d6271",
        "0xb51e456cb9b64783f77b9e04eeeaf123adf654ea",
        "0x27c8c3d2a8c786fcffc376863ff4ce207539fc79"
    ];

    const description = "TestContract1,TestContract2,TestContract3"

    let register;
    let version;

    before(async () => {
        register = await ProtocolRegister.new();            
    })

    describe("Registering", function () {

        it("owner can register new protocol", async () => {
            version = (await register.registerProtocol.call(description, protocol)).toNumber();
            assert.equal(version, 1);
            let tx = await register.registerProtocol(description, protocol);
            assert.equal(tx.logs[0].event, "VersionRegistered");
        })

        it("non owner can NOT register new protocol", async () => {
            await assertThrows(register.registerProtocol(description, protocol, {from: user1}));
        })
    })

    describe("Reading", function () {

        it("one can read protocol", async () => {
            let contracts = await register.getProtocol.call(version);
            assert.deepEqual(contracts, protocol);
        })

        it("one can read contract", async () => {
            let contract = await register.getContract.call(version, 1);
            assert.equal(contract, protocol[1]);
        })
    })
})