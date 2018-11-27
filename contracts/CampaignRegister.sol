pragma solidity ^ 0.4.24;

import "./Versionable.sol";
import "./CompanyRegister.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CampaignRegsiter is Versionable, Ownable {

    struct Campaign {
        address id;
        address company;
        uint256 minRespondents;
        uint256 maxRespondents;
        uint256 budget;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(address => Campaign) internal campaigns;
    address[] internal campaignsList;
    CompanyRegister internal companyRegister;

    event CampaignCreated(
        address id,
        address company,
        uint256 minRespondents,
        uint256 maxRespondents,
        uint256 budget,
        uint256 startTime,
        uint256 endTime
    );

    event CampaignFinished(
        string id,
        uint256 respondents,
        uint256 budgetSpent,
        uint256 finishTime,
        uint256 duration
    );

    constructor(CompanyRegister _companyRegister) public {
        companyRegister = _companyRegister;
    }

    function createCampaign(
        address company, 
        uint256 minRespondents, 
        uint256 maxRespondents, 
        uint256 startTime, 
        uint256 endTime) 
        public payable onlyOwner 
        returns(address) {
        
        require(endTime > startTime, "endTime must be after startTime");
        require(startTime >= now, "Campaigns cannot be in the past");
        require(msg.value > 0, "Give some cash");
        // TODO: Check min max respondents

        uint256 nonce = campaignsList.length;
        address id = generateUniqueId(nonce);
        while (campaigns[id].id == id) {
            id = generateUniqueId(++nonce);
        }

        Campaign memory c = Campaign(id, company, minRespondents, maxRespondents, msg.value, startTime, endTime);
        campaigns[id] = c;
        campaignsList.push(id);
        emit CampaignCreated(id, company, minRespondents, maxRespondents, msg.value, startTime, endTime);
        return (id);
    }

    function getCampaign(address _id) public view returns(address, address, uint256, uint256, uint256, uint256, uint256) {
        require(campaigns[_id].id == _id, "Campaign doesn't exist");
        Campaign storage c = campaigns[_id];
        return (c.id, c.company, c.minRespondents, c.maxRespondents, c.budget, c.startTime, c.endTime);
    }

    function getCampaignsList() public view returns(address[]) {
        return campaignsList;
    }

    function generateUniqueId(uint256 nonce) internal pure returns (address) {
        bytes20 id = ripemd160(keccak256(abi.encodePacked(nonce, blockhash(block.number-1), block.timestamp)));
        return address(id);
    }
}
