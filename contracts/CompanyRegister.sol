pragma solidity ^ 0.4.24;

contract CompanyRegister {

    struct Company {
        string name;
        uint256 balance;
        bytes32 id;
        uint256 createdTime;
        uint256 lastCampaignTime;
        uint256 spent;
        address owner;
    }

    string public protocol;
    uint256 public minimumBalance;

    mapping(bytes32 => Company) internal companyMap;
    bytes32[] internal companyList;

    event CompanyRegistered(
        Company company
    );

    constructor() internal {
    }

    function registerCompany(string name, string country) public payable {
    }
}