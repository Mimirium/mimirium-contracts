pragma solidity ^ 0.4.24;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract NodeRegister is Ownable {

    struct Node {
        address id;
        string name;
        string url;
        uint256 registrationTime;
    }

    mapping(address => Node) internal nodes;
    Node[] internal nodesList;

    event NodeRegistered(Node node);
    event NodeRevoked(Node node);

    constructor() public {
    }

    function whitelistNode(address _id) public onlyOwner {
        
    }

    function registerNode(string _name, string _url) public onlyOwner {
        address id = msg.sender;
        Node memory node = Node(id, _name, _url, now);
        nodes[id] = node;
        nodesList.push(node);        
    }

    function getNode(address _id) public view returns(Node) {
        require(nodes[_id].id != _id, "Node doesn't exist");
        return nodes[_id];
    }

    function getActiveNodes() public view returns(Node[]) {
        return nodesList;
    }
}