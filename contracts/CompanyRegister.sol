pragma solidity >0.4.99 <0.6.0;

import "./Versionable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CompanyRegister is Versionable, Ownable {

    struct Company {
        bytes32 id;
        string multihash;
        string name;
        uint256 balance;
        uint256 createdTime;
        uint256 lastCampaignTime;
        uint256 spent;
    }

    mapping(bytes32 => Company) internal companies;
    bytes32[] internal companiesList;

    event CompanyRegistered(
        bytes32 id,
        string multihash,
        string name,
        uint256 createdTime
    );

    constructor() public {
    }

    function registerCompany(string memory _multihash, string memory _name) public onlyOwner returns(bytes32) {
        bytes32 id = generateUniqueId();
        Company memory c = Company(id, _multihash, _name, 0, now, 0, 0);
        companies[id] = c;
        companiesList.push(id);
        emit CompanyRegistered(id, _multihash, _name, now);
        return id;
    }

    function companyExists(bytes32 _id) public view returns(bool) {
        return (_id != bytes32(0) && companies[_id].id == _id);
    }

    function getCompany(bytes32 _id) public view returns(bytes32, string memory, string memory, uint256, uint256, uint256, uint256) {        
        require(companyExists(_id), "Company doesn't exist");
        Company memory c = companies[_id];
        return (c.id, c.multihash, c.name, c.balance, c.createdTime, c.lastCampaignTime, c.spent);
    }

    function getCompaniesList() public view returns(bytes32[] memory) {
        return companiesList;
    }

    function generateUniqueId() internal view returns (bytes32) {
        bytes32 id;
        uint256 nonce = companiesList.length;
        
        do {
            id = keccak256(abi.encodePacked(nonce, blockhash(block.number-1), now));
            nonce ++;
        } while (companies[id].id == id);

        return id;
    }
}