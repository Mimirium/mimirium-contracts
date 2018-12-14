pragma solidity ^ 0.4.24;

import "./Versionable.sol";
import "./CompanyRegister.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CampaignRegister is Versionable, Ownable {

    enum DataType { Survey, DataMining, FederatedLearning }

    struct Campaign {
        address id;
        DataType dataType;
        address company;
        uint256 minRespondents;
        uint256 maxRespondents;
        uint256 budget;
        uint256 startTime;
        uint256 endTime;
    }

    mapping(address => Campaign) internal campaigns;
    address[] internal campaignsList;
    CompanyRegister private companyReg;

    event CampaignCreated(
        address id,
        DataType dataType,
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

    constructor(address _companyRegister) public {
        companyReg = CompanyRegister(_companyRegister);
    }

    function createCampaign(
        DataType _dataType,
        address _company, 
        uint256 _minRespondents, 
        uint256 _maxRespondents, 
        uint256 _startTime, 
        uint256 _endTime) 
        public payable onlyOwner 
        returns(address) {        
        require(companyReg.companyExists(_company), "This company is not registered");
        require(_endTime > _startTime, "endTime must be after startTime");
        require(_startTime >= now, "Campaigns cannot be in the past");
        require(msg.value > 0, "Give some cash");
        // TODO: Check min max respondents

        uint256 nonce = campaignsList.length;
        address id = generateUniqueId(nonce);
        while (campaigns[id].id == id) {
            id = generateUniqueId(++nonce);
        }

        Campaign memory c = Campaign(id, _dataType, _company, _minRespondents, _maxRespondents, msg.value, _startTime, _endTime);
        campaigns[id] = c;
        campaignsList.push(id);
        emit CampaignCreated(id, _dataType, _company, _minRespondents, _maxRespondents, msg.value, _startTime, _endTime);
        return (id);
    }
    
    function getCampaign(address _id) public view returns(address, DataType, address, uint256, uint256, uint256, uint256, uint256) {
        require(campaigns[_id].id == _id, "Campaign doesn't exist");
        Campaign storage c = campaigns[_id];
        return (c.id, c.dataType, c.company, c.minRespondents, c.maxRespondents, c.budget, c.startTime, c.endTime);
    }

    // TODO: Implement time filter
    function getCampaignsList() public view returns(address[]) {
        return campaignsList;
    }

    function generateUniqueId(uint256 _nonce) internal view returns (address) {
        bytes20 id = ripemd160(abi.encodePacked(keccak256(abi.encodePacked(_nonce, blockhash(block.number-1), block.timestamp))));
        return address(id);
    }
}
