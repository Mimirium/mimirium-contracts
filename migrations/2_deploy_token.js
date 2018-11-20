var MimiriumToken = artifacts.require("./MimiriumToken.sol");
var MimiriumExchange = artifacts.require("./MimiriumExchange.sol");
var fs = require('fs');

saveJson = function (network, contractData) {
    let filename = "./release/" + network + ".json";
    let jsonData = JSON.stringify(contractData, null, "\t");
    fs.writeFile(filename, jsonData, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = function (deployer, network) {
    deployer
        .deploy(MimiriumToken)
        .then((token) => {
            return deployer.deploy(MimiriumExchange, token.address)
        }).then((exchange) => {

        })
};
