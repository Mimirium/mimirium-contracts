module.exports = {
    norpc: true,
    testCommand: 'npx truffle test --network coverage',
    compileCommand: 'npx truffle compile --network coverage',
    copyPackages: ['openzeppelin-solidity'],
    skipFiles: ["Migrations.sol"]
};