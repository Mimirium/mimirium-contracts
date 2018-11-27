const assertThrows = require("./utils/assertThrows.js");
const NodeRegister = artifacts.require('./NodeRegister.sol')

contract('NodeRegister', function (accounts) {

    const [
        owner,
        node1,
        node2,
        user1
    ] = accounts;

    let register;

    before(async () => {
        register = await NodeRegister.new();            
    })

    describe("Registering", function () {

        it("owner can whitelist node", async () => {
            let tx = await register.whitelistNode(node1);
            assert.equal(tx.logs[0].event, "NodeWhitelisted");
        })

        it("non owner can NOT whitelist node", async () => {
            await assertThrows(register.whitelistNode(node1, {from: user1}));
        })

        it("whitelisted node can register", async () => {
            let node = await register.registerNode.call("Test Node1", "http://testurl.com/", {from: node1});
            assert(node[0], node1);
            assert(node[1], "Test Node1");
            assert(node[2], "http://testurl.com/");
            await register.registerNode("Test Node1", "http://testurl.com/", {from: node1});
        })

        it("not whitelisted node can NOT register", async () => {
            await assertThrows(register.registerNode("Test Node2", "http://testurl.com/", {from: node2}));
        })
    })

    describe("Listing", function () {

        let nodesList;

        it("node list can be retrieved", async () => {
            nodesList = await register.getNodesList();
            assert.isNotEmpty(nodesList);
        })

        it("node data can be retrieved", async () => {
            console.log(nodesList[0]);
            let node = await register.getNode(nodesList[0]);
            assert(node[0], node1);
            assert(node[1], "Test Node1");
            assert(node[2], "http://testurl.com/");
        })
    })
})