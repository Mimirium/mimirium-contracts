pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";

contract MimiriumToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {

    constructor()  
        ERC20Detailed("Mimirium", "MMR", 18) public {
    }
}