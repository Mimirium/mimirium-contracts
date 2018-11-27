pragma solidity ^ 0.4.24;

contract Surveys {

    struct Survey {
        string id;
        uint256 minRespondents;
        uint256 maxRespondents;
        uint256 budget;
        uint256 startTime;
        uint256 endTime;
    }
    bytes32[] internal surveyList;
    mapping(bytes32 => Survey) internal surveyMap;
    address public owner;

    event SurveyAdded(bytes32 idHash, string id);
    event SurveyExpired(bytes32 idHash, string id);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is allowed to do that");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function addSurvey(
        string _id,
        uint256 _minRespondents,
        uint256 _maxRespondents,
        uint256 _endTime) public payable onlyOwner {

        require(msg.value > 0, "You need to put some cash");
        require(_maxRespondents >= _minRespondents, "Max respondents must be bigger or equal to min");
        require(_endTime > block.timestamp, "Invalid time");

        bytes32 idHash = keccak256(abi.encodePacked(_id));
        require(surveyMap[idHash].startTime == 0, "Survey already exists");

        Survey memory s = Survey(
            _id,
            _minRespondents,
            _maxRespondents,
            msg.value,
            block.timestamp,
            _endTime
        );
        surveyMap[idHash] = s;
        surveyList.push(idHash);
        emit SurveyAdded(idHash, _id);
    }

    function getAllSurveys() public view returns(bytes32[]) {
        return surveyList;
    }

    function getSurvey(bytes32 _idHash) public view returns (string, uint256, uint256, uint256, uint256, uint256) {
        Survey memory s = surveyMap[_idHash];
        return (s.id, s.minRespondents, s.maxRespondents, s.budget, s.startTime, s.endTime);
    }

    function cleanSurveys() internal {
        for (uint256 i = 0; i < surveyList.length; i ++) {
            bytes32 idHash = surveyList[i];
            Survey memory s = surveyMap[idHash];
            if (s.endTime <= block.timestamp) {
                emit SurveyExpired(idHash, s.id);
                delete surveyMap[idHash];
                delete surveyList[i];
            }
        }
    }
}
