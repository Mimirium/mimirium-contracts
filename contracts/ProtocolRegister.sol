pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

// TODO: Refactor to support multiple owners

contract ProtocolRegister is Ownable {

    address[][] private _contracts;

    event VersionRegistered(uint256 version, string description, address[] addresses);

    constructor() public {
    }

    function registerProtocol(string memory _description, address[] memory _addresses) public onlyOwner returns(uint256) {
        uint256 version = _contracts.push(_addresses);
        emit VersionRegistered(version, _description, _addresses);
        return version;
    }

    function getProtocol(uint256 _version) public view returns(address[] memory) {
        require(_version <= _contracts.length, "Invalid version");
        return _contracts[_version-1];
    }

    function getContract(uint256 _version, uint256 _contract) public view returns(address) {
        require(_version <= _contracts.length, "Invalid version");
        require(_contract < _contracts[_version-1].length, "Invalid version");
        return _contracts[_version-1][_contract];
    }
}