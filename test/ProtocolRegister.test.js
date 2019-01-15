const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const ProtocolRegister = artifacts.require('./ProtocolRegister.sol')

contract('ProtocolRegister', function (accounts) {

    const [
        OWNER,
        USER1
    ] = accounts;

    const PROTOCOL = [
        "0x92D66a311a2314CA5402f51423E70f4F223D6271",
        "0xb51e456cb9b64783F77B9E04EeeAF123adf654EA",
        "0x27C8c3d2a8c786fcFfc376863fF4CE207539fC79"
    ];

    const DESCRIPTION = "TestContract1,TestContract2,TestContract3"

    let register;
    let version;

    before(async () => {
        register = await ProtocolRegister.new();            
        assert.isNotNull(register);
    })

    describe("Registering", function () {

        it("owner can register new protocol", async () => {
            version = await register.registerProtocol.call(DESCRIPTION, PROTOCOL, {from: OWNER});
            assert.equal(version, 1);
            let tx = await register.registerProtocol(DESCRIPTION, PROTOCOL, {from: OWNER});
            assertEvent(tx, "VersionRegistered");
        })

        it("non owner can NOT register new protocol", async () => {
            await assertFail(register.registerProtocol(DESCRIPTION, PROTOCOL, {from: USER1}));
        })
    })

    describe("Reading", function () {

        it("one can read protocol", async () => {
            let contracts = await register.getProtocol.call(version);
            assert.deepEqual(contracts, PROTOCOL);
        })

        it("one can read contract", async () => {
            let contract = await register.getContract.call(version, 1);
            assert.equal(contract, PROTOCOL[1]);
        })
    })
})