pragma solidity ^ 0.4.24;

import "./Versionable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract NodeRegister is Versionable, Ownable {

    enum NodeStatus { None, Registered, Active, Suspended }

    struct Node {
        address id;
        string name;
        string url;
        uint256 registrationTime;
        uint256 balance;
        NodeStatus status;
    }

    mapping(address => Node) internal nodes;
    address[] internal nodesList;

    event NodeRegistered(address id, string name, string url);
    event NodeActivated(address id, uint256 balance);
    event NodeSuspended();

    modifier onlyRegistered() {
        require(nodes[msg.sender].status >= NodeStatus.Registered, "Address not registered");
        _;
    }

    constructor() public {
    }

    function registerNode(address _id, string _name, string _url) public onlyOwner 
    returns (address, string, string, uint256, uint256, NodeStatus) {
        require(nodes[_id].status < NodeStatus.Registered, "Address already is registered");
        Node memory n = Node(_id, _name, _url, now, 0, NodeStatus.Registered);
        nodes[_id] = n;
        nodesList.push(_id);
        emit NodeRegistered(_id, _name, _url);
        return (n.id, n.name, n.url, n.registrationTime, n.balance, n.status);
    }

    function activateNode() public payable onlyRegistered {
        require(msg.value >= 1 ether, "Insuficient funds");
        address id = msg.sender;
        uint256 balance = msg.value;
        require(nodes[id].status >= NodeStatus.Registered, "Node not registered");
        Node memory n = nodes[id];
        n.balance += balance;
        n.status = NodeStatus.Active;
        emit NodeActivated(id, balance);
    }

    function getNode(address _id) public view returns(address, string, string, uint256, uint256, NodeStatus) {        
        require(nodes[_id].id == _id, "Node doesn't exist");
        Node memory n = nodes[_id];
        return (n.id, n.name, n.url, n.registrationTime, n.balance, n.status);
    }

    function getNodesList() public view returns(address[]) {
        return nodesList;
    }
}