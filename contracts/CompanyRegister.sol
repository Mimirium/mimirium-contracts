pragma solidity ^ 0.4.24;

import "./Versionable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CompanyRegister is Versionable, Ownable {

    struct Company {
        address id;
        string name;
        uint256 balance;
        uint256 createdTime;
        uint256 lastCampaignTime;
        uint256 spent;
    }

    mapping(address => Company) internal companies;
    address[] internal companiesList;

    event CompanyRegistered(
        address id,
        string name,
        uint256 createdTime
    );

    constructor() public {
    }

    function registerCompany(string _name) public onlyOwner returns(address) {
        uint256 nonce = companiesList.length;
        address id = generateUniqueId(nonce);
        while (companies[id].id == id) {
            id = generateUniqueId(++nonce);
        }
        
        Company memory c = Company(id, _name, 0, now, 0, 0);
        companies[id] = c;
        companiesList.push(id);
        emit CompanyRegistered(id, _name, now);
        return (id);
    }

    function companyExists(address _id) public view returns(bool) {
        return (_id != address(0) && companies[_id].id == _id);
    }

    function getCompany(address _id) public view returns(address, string, uint256, uint256, uint256, uint256) {        
        require(companyExists(_id), "Company doesn't exist");
        Company memory c = companies[_id];
        return (c.id, c.name, c.balance, c.createdTime, c.lastCampaignTime, c.spent);
    }

    function getCompaniesList() public view returns(address[]) {
        return companiesList;
    }

    function generateUniqueId(uint256 _nonce) internal view returns (address) {
        bytes20 id = ripemd160(keccak256(abi.encodePacked(_nonce, blockhash(block.number-1), block.timestamp)));
        return address(id);
    }
}