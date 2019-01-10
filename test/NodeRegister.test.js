const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const NodeRegister = artifacts.require('./NodeRegister.sol');
const isBN = web3.utils.isBN;

contract('NodeRegister', function (accounts) {

    const [
        OWNER,
        NODE1,
        NODE2,
        USER1
    ] = accounts;

    let register;

    before(async () => {
        register = await NodeRegister.new();            
        assert.isNotNull(register);
    })

    describe("Registering", function () {

        it("owner can register node", async () => {
            let tx = await register.registerNode(NODE1, "Test Node1", "http://testurl.com/");
            assertEvent(tx, "NodeRegistered", [
                NODE1, "Test Node1", "http://testurl.com/"
            ]);

            let node = await register.registerNode.call(NODE2, "Test Node2", "http://testurl.com/");
            assert.hasAllKeys(node, ["0", "1", "2", "3", "4", "5"], "Invalid struct returned");
            assert.equal(node["0"], NODE2, "Incorrect id");
            assert.equal(node["1"], "Test Node2", "Incorrect name");
            assert.equal(node["2"], "http://testurl.com/", "Incorrect url");
            assert(isBN(node["3"]), "Incorrect registrationTime");
            assert(isBN(node["4"]), "Incorrect balance");
            assert(isBN(node["5"]) && node["5"].toNumber() == 1, "Incorrect status");
        })

        it("non owner can NOT register node", async () => {
            let sender = USER1;
            await assertFail(register.registerNode(NODE2, "Test Node2", "http://testurl2.com/", {from: sender}));
        })

        it("owner can NOT register same node twice", async () => {
            await assertFail(register.registerNode(NODE1, "Test Node1", "http://testurl1.com/"));
        })

        it("registered nodes can activate themselves", async () => {
            let investment = web3.utils.toWei(web3.utils.toBN(2), "ether");
            let tx = await register.activateNode({from: NODE1, value: investment});
            assertEvent(tx, "NodeActivated", [NODE1, investment]);
        })

        it("registered nodes can NOT activate themselves without paying at least 1 ether", async () => {
            let investment = web3.utils.toWei(web3.utils.toBN(1), "gwei");
            await assertFail(register.activateNode({from: NODE1, value: investment}));
        })

        it("not registered node can NOT activate", async () => {
            let investment = web3.utils.toWei(web3.utils.toBN(2), "ether");
            await assertFail(register.activateNode({from: NODE2, value: investment}));
        })
    })

    describe("Listing", function () {

        let nodesList;

        it("node list can be retrieved", async () => {
            nodesList = await register.getNodesList();
            assert.isNotEmpty(nodesList);
        })

        it("node data can be retrieved", async () => {
            let node = await register.getNode(nodesList[0]);
            assert.hasAllKeys(node, ["0", "1", "2", "3", "4", "5"], "Invalid struct returned");
            assert.equal(node["0"], NODE1, "Incorrect id");
            assert.equal(node["1"], "Test Node1", "Incorrect name");
            assert.equal(node["2"], "http://testurl.com/", "Incorrect url");
            assert(isBN(node["3"]), "Incorrect registrationTime");
            assert(isBN(node["4"]), "Incorrect balance");
            assert(isBN(node["5"]) && node["5"].toNumber() == 2, "Incorrect status");
        })
    })
})