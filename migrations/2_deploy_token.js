const MimiriumToken = artifacts.require("./MimiriumToken.sol");
const MimiriumExchange = artifacts.require("./MimiriumExchange.sol");
const ContractConfig = require("../js/ContractConfig.js");

module.exports = function(deployer, network) {
    ContractConfig.init(network);
    deployer
        .deploy(MimiriumToken)
        .then((token) => {
            ContractConfig.addContract(network, "MimiriumToken", token.address, token.abi);
            return deployer.deploy(MimiriumExchange, token.address)
        }).then((exchange) => {
            ContractConfig.addContract(network, "MimiriumExchange", exchange.address, exchange.abi);
        })
};
