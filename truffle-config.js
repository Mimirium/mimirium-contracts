const HDWallet = require('./hd-wallet')
const HDWalletProvider = require("@truffle/hdwallet-provider")

const {
  name: packageName,
    version,
    description,
    keywords,
    license
} = require('./package.json')

const DEFAULT = {
    host: 'localhost',
    port: 8545,
    network_id: '*', // Match any network id
    gas: 4e6,
    gasPrice: 2e9
}

const walletPath = './wallet.json'
const wallet = HDWallet(walletPath)

module.exports = {
    packageName,
    version,
    description,
    keywords,
    license,
    authors: [
        'Mimirium <info@mimirium.io>'
    ],
    networks: {
        development: { ...DEFAULT},
        ropsten: {
            network_id: 3,
            provider: function () {
                return new HDWalletProvider(wallet.mnemonic, "https://ropsten.infura.io/" + wallet.infuraToken)
            },
            gas: 4700000,
            gasPrice: 2e9
        },
        rinkeby: {
            network_id: 3,
            provider: function () {
                return new HDWalletProvider(wallet.mnemonic, "https://rinkeby.infura.io/" + wallet.infuraToken)
            },
            gas: 4700000,
            gasPrice: 2e9
        },
        mainnet: {
            network_id: 1,
            provider: function () {
                return new HDWalletProvider(wallet.mnemonic, "https://mainnet.infura.io/" + wallet.infuraToken)
            },
            gas: 5000000,
            gasPrice: 2e9
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8545,         // <-- If you change this, also set the port option in .solcover.js.
            gas: 0xfffffffffff, // <-- Use this high gas value
            gasPrice: 0x01      // <-- Use this low gas price
        },
      
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
}
