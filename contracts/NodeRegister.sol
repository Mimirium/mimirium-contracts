pragma solidity ^ 0.4.24;

import "./Versionable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract NodeRegister is Versionable, Ownable {

    struct Node {
        address id;
        string name;
        string url;
        uint256 registrationTime;
    }

    mapping(address => bool) internal whitelisted;

    mapping(address => Node) internal nodes;
    address[] internal nodesList;

    event NodeRegistered(Node node);
    event NodeRevoked(Node node);
    event NodeWhitelisted(address id);

    modifier onlyWhitelisted() {
        require(whitelisted[msg.sender] == true, "Address not whitelisted");
        _;
    }

    constructor() public {
    }

    function whitelistNode(address _id) public onlyOwner {
        whitelisted[_id] = true;
        emit NodeWhitelisted(_id);
    }

    function registerNode(string _name, string _url) public onlyWhitelisted returns(address, string, string, uint256) {
        address id = msg.sender;
        Node memory n = Node(id, _name, _url, now);
        nodes[id] = n;
        nodesList.push(id);
        return (n.id, n.name, n.url, n.registrationTime);
    }

    function getNode(address _id) public view returns(address, string, string, uint256) {        
        require(nodes[_id].id == _id, "Node doesn't exist");
        Node memory n = nodes[_id];
        return (n.id, n.name, n.url, n.registrationTime);
    }

    function getNodesList() public view returns(address[]) {
        return nodesList;
    }
}