pragma solidity >0.4.99 <0.6.0;

contract Versionable {

    uint256 public version;

    constructor() internal {
        version = 1;
    }
}