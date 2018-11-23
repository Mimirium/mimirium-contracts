pragma solidity ^ 0.4.24;

contract Versionable {

    string public version;

    constructor() internal {
        version = "0.1";
    }
}