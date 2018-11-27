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
            let node = await register.registerCompany.call("Test Company1", {from: owner});
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