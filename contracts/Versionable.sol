pragma solidity ^0.5.0;

contract Versionable {

    uint256 public version;

    constructor() internal {
        version = 1;
    }
}