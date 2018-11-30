pragma solidity ^0.4.24;

import "./MimiriumToken.sol";
import "./Versionable.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MimiriumExchange is Versionable, Ownable {
    using SafeMath for uint256;

    MimiriumToken public token;
    uint256 public rate;

    event RateChanged(uint256 oldRate, uint256 newRate);
    event MimiriumsPurchased(uint256 mimiriums, uint256 ethers, uint256 rate);
    event MimiriumsSold(uint256 mimiriums, uint256 ethers, uint256 rate);

    constructor(MimiriumToken _token) public {
        token = _token;
        rate = 1;
    }

    function setRate(uint256 _newRate) public {
        require(msg.sender == owner(), "Not owner");
        require(_newRate > 0, "Rate must be greated than 0");
        require(_newRate != rate, "Same rate provided");
        emit RateChanged(rate, _newRate);
        rate = _newRate;
    }

    function () public payable {
        _buy(msg.sender, msg.value);
    }

    function buy() public payable {
        _buy(msg.sender, msg.value);
    }

    function sell(uint256 _mimirAmount) public {
        _sell(msg.sender, _mimirAmount);
    }

    function _buy(address _purchaser, uint256 _weiAmount) internal {
        require(_weiAmount > 0, "Give some cash please");
        uint256 mimirAmount = _weiAmount.mul(rate);
        token.mint(_purchaser, mimirAmount);
        emit MimiriumsPurchased(mimirAmount, _weiAmount, rate);
    }

    function _sell(address _seller, uint256 _mimirAmount) internal {
        require(_seller != address(0), "Non null address require");
        uint256 weiAmount = _mimirAmount.div(rate);
        require (token.balanceOf(_seller) >= _mimirAmount, "You don't have such amount of mimiriums");
        require (token.allowance(_seller, address(this)) >= _mimirAmount, "You need to approve the contract for this amount first");
        require (address(this).balance >= weiAmount, "Insufficient funds");
        token.burnFrom(_seller, _mimirAmount);
        _seller.transfer(weiAmount);
        emit MimiriumsSold(_mimirAmount, weiAmount, rate);
    }
}
