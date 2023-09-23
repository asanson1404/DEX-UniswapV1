// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {

    address public xelaTokenAddress;

    // Smart contract responsible of minting and issuing LP Tokens (is ERC20)
    constructor(address _xelaTokenAddress) ERC20("ETH   XELA LP Token", "lpETHXELA") {
        require(_xelaTokenAddress != address(0), "TOKEN_ADDRESS_PASSED_IS_NULL");
        xelaTokenAddress = _xelaTokenAddress;
    }

    // Returns the balance of Xela Token held by 'this' contract
    function getXelaReserve() public view returns (uint256) {
        return ERC20(xelaTokenAddress).balanceOf(address(this));
    }


}