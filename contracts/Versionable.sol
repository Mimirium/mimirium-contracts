pragma solidity ^ 0.4.24;

contract Versionable {

    uint256 public version;

    constructor() internal {
        version = 1;
    }
}