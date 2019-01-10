const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const MimiriumToken = artifacts.require('./MimiriumToken.sol')

contract('MimiriumToken', function (accounts) {

    const [
        OWNER,
        USER1
    ] = accounts;

    const ONE_ETHER = web3.utils.toWei(web3.utils.toBN(1), "ether");

    let token;

    beforeEach(async () => {
        token = await MimiriumToken.new();            
        assert.isNotNull(token);
        console.log(typeof ONE_ETHER);
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
            let balanceBefore = await token.balanceOf(USER1);
            let quantity = ONE_ETHER;

            let tx = await token.mint(USER1, quantity);
            assertEvent(tx, "Transfer");

            let balanceAfter = await token.balanceOf(USER1);
            assert(balanceAfter.eq(balanceBefore.add(quantity)));
        })

        it("can NOT be minted by non-minter", async () => {
            let quantity = ONE_ETHER;
            await assertFail(token.mint(USER1, quantity, {from: USER1}));
        })
    })
})