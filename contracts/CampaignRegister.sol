pragma solidity >0.4.99 <0.6.0;

import "./Versionable.sol";
import "./CompanyRegister.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

// TODO: Replace ownable with multiple roles
// TODO: Replace ether budget with mimiriums
// TODO: Add logic for campaign completion
// TODO: Implement time filter, so only new campaigns can be fetched
// TODO: Check min max respondents
contract CampaignRegister is Versionable, Ownable {

    enum DataTypes { Survey, DataMining, FederatedLearning }

    struct Campaign {
        bytes32 id;
        string multihash;
        DataTypes dataType;
        bytes32 company;
        uint256 minRespondents;
        uint256 maxRespondents;
        uint256 budget;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(bytes32 => Campaign) internal campaigns;
    bytes32[] internal campaignsList;
    CompanyRegister private companyReg;

    event CampaignCreated(
        bytes32 id,
        string multihash,
        DataTypes dataType,
        bytes32 company,
        uint256 minRespondents,
        uint256 maxRespondents,
        uint256 budget,
        uint256 startTime,
        uint256 endTime
    );

    event CampaignFinished(
        bytes32 id,
        uint256 respondents,
        uint256 budgetSpent,
        uint256 finishTime,
        uint256 duration
    );

    constructor(address _companyRegister) public {
        companyReg = CompanyRegister(_companyRegister);
    }

    function createCampaign(
        string memory _multihash,
        DataTypes _dataType,
        bytes32 _company,
        uint256 _minRespondents,
        uint256 _maxRespondents,
        uint256 _startTime,
        uint256 _endTime)
        public payable onlyOwner
        returns(bytes32) {  
        require(companyReg.companyExists(_company), "This company is not registered");
        require(_endTime > _startTime, "endTime must be after startTime");
        require(_startTime >= now, "Campaigns cannot be in the past");
        require(msg.value > 0, "Give some cash");

        bytes32 id = generateUniqueId();
        Campaign memory c = Campaign(id, _multihash, _dataType, _company, _minRespondents, _maxRespondents, msg.value, _startTime, _endTime);
        campaigns[id] = c;
        campaignsList.push(id);
        emit CampaignCreated(id, _multihash, _dataType, _company, _minRespondents, _maxRespondents, msg.value, _startTime, _endTime);
        return id;
    }
    
    function getCampaign(bytes32 _id) public view 
        returns(bytes32, string memory, DataTypes, bytes32, uint256, uint256, uint256, uint256, uint256) {
        require(campaigns[_id].id == _id, "Campaign doesn't exist");
        Campaign storage c = campaigns[_id];
        return (c.id, c.multihash, c.dataType, c.company, c.minRespondents, c.maxRespondents, c.budget, c.startTime, c.endTime);
    }
    
    function getCampaignsList() public view returns(bytes32[] memory) {
        return campaignsList;
    }

    function generateUniqueId() internal view returns (bytes32) {
        bytes32 id;
        uint256 nonce = campaignsList.length;
        
        do {
            id = keccak256(abi.encodePacked(nonce, blockhash(block.number-1), now));
            nonce ++;
        } while (campaigns[id].id == id);

        return id;
    }
}
