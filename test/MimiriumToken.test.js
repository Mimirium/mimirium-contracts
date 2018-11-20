const assertThrows = require("./utils/assertThrows.js");
const MimiriumToken = artifacts.require('./MimiriumToken.sol')

contract('MimiriumToken', function (accounts) {

    const [
        owner,
        user1
    ] = accounts;

    let token;

    beforeEach(async () => {
        token = await MimiriumToken.new();            
    })

    describe("Deployment", function () {

        it("has the correct values", async () => {
            assert.isNotNull(token);
            let name = await token.name();
            let symbol = await token.symbol();
            let decimals = await token.decimals();
            assert.equal(name, "Mimirium");
            assert.equal(symbol, "MMR");
            assert.equal(decimals, "18");
        })
    })

    describe("Minting", function () {

        it("can be minted by minter", async () => {
            let balanceBefore = (await token.balanceOf(user1)).toNumber();
            let quantity = web3.toWei(1, "ether");
            let tx = await token.mint(user1, quantity);
            let balanceAfter = (await token.balanceOf(user1)).toNumber();
            assert.equal(balanceAfter, balanceBefore + quantity);

        })

        it("can NOT be minted by non-minter", async () => {
            let quantity = web3.toWei(1, "ether");
            await assertThrows(token.mint(user1, quantity, {from: user1}));
        })
    })
})