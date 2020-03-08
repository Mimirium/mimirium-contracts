const fs = require('fs');

class ContractConfig {

    static init(network) {
        this._save(ContractConfig._getPath(network), {});
    }

    static _load(path) {
        return (fs.existsSync(path)) ?
            JSON.parse(fs.readFileSync(path)) : {};
    }

    static _getPath(network) {
        return "./release/" + network + ".json";
    }

    static _save(path, data) {
        let jsonData = JSON.stringify(data, null, "\t");
        let err = fs.writeFileSync(path, jsonData);
        if (err) {
            console.log(err);
        }
    }

    static addContract(network, contractName, contractAddress, contractAbi) {
        let path = ContractConfig._getPath(network);
        let data = ContractConfig._load(path);
        data[contractName] = {
            address: contractAddress,
            abi: JSON.stringify(contractAbi)
        }
        ContractConfig._save(path, data);
    }

    static getContract(network, contractName) {
        let data = ContractConfig._load(ContractConfig._getPath(network));
        return data[contractName];
    }

    static getProtocol(network) {
        let data = ContractConfig._load(ContractConfig._getPath(network));
        let addresses = [];
        let description = "";
        for (let contract in data) {
            if (description.length > 0)
                description += ",";
            description += contract;
            addresses.push(data[contract].address);
        }
        return { "description": description, "addresses": addresses };
    }
}

module.exports = ContractConfig;
