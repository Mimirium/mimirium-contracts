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

        it("owner can register node", async () => {
            let tx = await register.registerNode(node1, "Test Node1", "http://testurl.com/");
            assert.equal(tx.logs[0].event, "NodeRegistered");

            let node = await register.registerNode.call(node1, "Test Node1", "http://testurl.com/");
            assert.equal(node[0], node1);
            assert.equal(node[1], "Test Node1");
            assert.equal(node[2], "http://testurl.com/");
        })

        it("non owner can NOT register node", async () => {
            await assertThrows(register.registerNode(node2, "Test Node2", "http://testurl2.com/", {from: user1}));
        })

        it("owner can NOT register same node twice", async () => {
            await assertThrows(register.registerNode(node1, "Test Node1", "http://testurl1.com/"));
        })

        it("registered nodes can activate themselves", async () => {
            let tx = await register.activateNode({from: node1, value: web3.toWei(2, 'ether')});
            assert.equal(tx.logs[0].event, "NodeActivated");
        })

        it("registered nodes can NOT activate themselves without paying at least 1 ether", async () => {
            await assertThrows(register.activateNode({from: node1, value: web3.toWei(1, 'gwei')}));
        })

        it("not registered node can NOT activate", async () => {
            await assertThrows(register.activateNode({from: node2, value: web3.toWei(2, 'ether')}));
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
            assert.equal(node[0], node1);
            assert.equal(node[1], "Test Node1");
            assert.equal(node[2], "http://testurl.com/");
        })
    })
})