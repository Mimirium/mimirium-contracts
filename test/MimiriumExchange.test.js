const assertThrows = require("./utils/assertThrows.js");
const MimiriumToken = artifacts.require('./MimiriumToken.sol')
const MimiriumExchange = artifacts.require('./MimiriumExchange.sol')

contract('MimiriumExchange', function (accounts) {

    const [
        owner,
        user1
    ] = accounts;

    let token;
    let exchange;

    before(async () => {
        token = await MimiriumToken.new();            
        exchange = await MimiriumExchange.new(token.address);
    })

    describe("Basic", function () {

        it("has the correct token", async () => {
            let contractToken = await exchange.token();
            assert.equal(token.address, contractToken);
        })

        it("can be added as minter", async () => {
            let tx = await token.addMinter(exchange.address);
            assert.equal(tx.logs[0].event, "MinterAdded");
        })

        it("owner can change the rate", async () => {
            let rate = await exchange.rate();
            let tx = await exchange.setRate(rate*2, {from: owner});
            assert.equal(tx.logs[0].event, "RateChanged");
        })

        it("non-owner can NOT change the rate", async () => {
            await assertThrows(exchange.setRate(1, {from: user1}));
        })
    })

    describe("Exchange", function () {

        const purchaseAmount = 1*10**9; // 1 Gwei

        it("can buy mimiriums", async () => {
            let balanceBefore = (await token.balanceOf(user1)).toNumber();
            let rate = await exchange.rate();
            let tx = await exchange.buy({from: user1, value: purchaseAmount});
            let balanceAfter = (await token.balanceOf(user1)).toNumber();
            assert.equal(balanceAfter, balanceBefore + purchaseAmount*rate);
            let balance = (await web3.eth.getBalance(exchange.address)).toNumber();
            assert.equal(balance, purchaseAmount);
        })

        it("can sell mimiriums", async () => {
            let totalSupplyBefore = (await token.totalSupply()).toNumber();
            let balanceBefore = (await token.balanceOf(user1)).toNumber();
            let sellAmount = balanceBefore;
            let tx1 = await token.approve(exchange.address, sellAmount, {from: user1});
            let tx2 = await exchange.sell(sellAmount, {from: user1});
            let balanceAfter = (await token.balanceOf(user1)).toNumber();
            let totalSupplyAfter = (await token.totalSupply()).toNumber();
            assert.equal(balanceAfter, 0);
            assert.equal(totalSupplyAfter, totalSupplyBefore - sellAmount);
        })
    })
})