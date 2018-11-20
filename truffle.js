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
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
}