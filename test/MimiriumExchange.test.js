const assertFail = require("./utils/assertFail.js");
const assertEvent = require("./utils/assertEvent.js");
const MimiriumToken = artifacts.require('./MimiriumToken.sol')
const MimiriumExchange = artifacts.require('./MimiriumExchange.sol')

contract('MimiriumExchange', function (accounts) {

    const [
        OWNER,
        USER1
    ] = accounts;

    let token;
    let exchange;

    before(async () => {
        token = await MimiriumToken.new();
        assert.isNotNull(token);
        exchange = await MimiriumExchange.new(token.address);
        assert.isNotNull(exchange);
    })

    describe("Basic", function () {

        it("has the correct token", async () => {
            let contractToken = await exchange.token();
            assert.equal(token.address, contractToken);
        })

        it("can be added as minter", async () => {
            let tx = await token.addMinter(exchange.address);
            assertEvent(tx, "MinterAdded");
        })

        it("owner can change the rate", async () => {
            let oldRate = await exchange.rate();
            let newRate = oldRate.mul(web3.utils.toBN(2));
            let tx = await exchange.setRate(newRate, {from: OWNER});
            assertEvent(tx, "RateChanged", [oldRate, newRate]);
        })

        it("non-owner can NOT change the rate", async () => {
            await assertFail(exchange.setRate(1, {from: USER1}));
        })
    })

    describe("Exchange", function () {

        const purchaseAmount = web3.utils.toBN(1*10**9); // 1 Gwei

        it("can buy mimiriums", async () => {
            let balanceBefore = await token.balanceOf(USER1);
            let rate = await exchange.rate();
            let mimirAmount = purchaseAmount.mul(rate);

            let tx = await exchange.buy({from: USER1, value: purchaseAmount});
            assertEvent(tx, "MimiriumsPurchased", [mimirAmount ,purchaseAmount, rate]);

            let balanceAfter = await token.balanceOf(USER1);
            assert(balanceAfter.eq(balanceBefore.add(mimirAmount)));

            let balance = await web3.eth.getBalance(exchange.address);
            assert(balance.toString() == purchaseAmount.toString());
        })

        it("can sell mimiriums", async () => {
            let totalSupplyBefore = await token.totalSupply();
            let balanceBefore = await token.balanceOf(USER1);
            let sellAmount = balanceBefore;
            let rate = await exchange.rate();
            let weiAmount = purchaseAmount;

            let tx1 = await token.approve(exchange.address, sellAmount, {from: USER1});
            assertEvent(tx1, "Approval");

            let tx2 = await exchange.sell(sellAmount, {from: USER1});
            assertEvent(tx2, "MimiriumsSold", [sellAmount, weiAmount, rate]);

            let balanceAfter = await token.balanceOf(USER1);
            let totalSupplyAfter = await token.totalSupply();
            assert.equal(balanceAfter.toString(), "0");
            assert(totalSupplyAfter.eq(totalSupplyBefore.sub(sellAmount)));
        })
    })
})