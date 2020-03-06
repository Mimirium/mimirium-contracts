pragma solidity >0.4.99 <0.6.0;

import "./Versionable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract MimiriumToken is Versionable, ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {

    constructor()
        ERC20Detailed("Mimirium", "MMR", 18) public {
    }
}