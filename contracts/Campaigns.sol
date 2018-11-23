pragma solidity ^ 0.4.24;

import "./Versionable.sol";

contract CompanyRegister is Versionable {

    struct Company {
        address id;
        string name;
        uint256 rating;
        uint256 registerTime;
        uint256 lastCampaignTime;
        uint256 spent;
        address registrar;
    }

    string public protocol;
    uint256 public minimumBalance;

    mapping(address => Company) internal companyMap;
    address[] internal companyList;

    event CompanyRegistered(
        Company company
    );

    constructor() public {
        
    }

    function registerCompany(string name, string country) public payable {
    }
}