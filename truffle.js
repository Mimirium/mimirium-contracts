const defaultGas = 4e6; // 400,000 gas
const defaultGasPrice = 12e9; // 12 Gwei

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            gas: defaultGas,
            gasPrice: defaultGasPrice,
            network_id: "*"
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8555,         // <-- If you change this, also set the port option in .solcover.js.
            gas: 0xfffffffffff, // <-- Use this high gas value
            gasPrice: 0x01      // <-- Use this low gas price
        },
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
}