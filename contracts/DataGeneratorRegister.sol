pragma solidity >0.4.99 <0.6.0;

import "./Versionable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

// TODO: Replace Ownable with Roles
contract DataGeneratorRegister is Versionable, Ownable {

    struct DataGenerator {
        bytes32 id;
        string multihash;
        string name;
        uint256 balance;
        uint256 createdTime;
        uint256 lastCampaignTime;
        uint256 spent;
    }

    mapping(bytes32 => DataGenerator) internal dataGenerators;
    bytes32[] internal dataGeneratorsList;

    event DataGeneratorRegistered(
        bytes32 id,
        string multihash,
        string name,
        uint256 createdTime
    );

    constructor() public {
    }

    function registerDataGenerator(string memory _multihash, string memory _name) public onlyOwner returns(bytes32) {
        bytes32 id = generateUniqueId();
        DataGenerator memory c = DataGenerator(id, _multihash, _name, 0, now, 0, 0);
        dataGenerators[id] = c;
        dataGeneratorsList.push(id);
        emit DataGeneratorRegistered(id, _multihash, _name, now);
        return id;
    }

    function dataGeneratorExists(bytes32 _id) public view returns(bool) {
        return (_id != bytes32(0) && dataGenerators[_id].id == _id);
    }

    function getDataGenerator(bytes32 _id) public view returns(bytes32, string memory, string memory, uint256, uint256, uint256, uint256) {
        require(dataGeneratorExists(_id), "Data generator doesn't exist");
        DataGenerator memory c = dataGenerators[_id];
        return (c.id, c.multihash, c.name, c.balance, c.createdTime, c.lastCampaignTime, c.spent);
    }

    function getDataGeneratorsList() public view returns(bytes32[] memory) {
        return dataGeneratorsList;
    }

    function generateUniqueId() internal view returns (bytes32) {
        bytes32 id;
        uint256 nonce = dataGeneratorsList.length;
        
        do {
            id = keccak256(abi.encodePacked(nonce, blockhash(block.number-1), now));
            nonce ++;
        } while (dataGenerators[id].id == id);

        return id;
    }
}