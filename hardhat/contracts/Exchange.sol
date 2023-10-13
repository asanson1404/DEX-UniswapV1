// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {

    address public xelaTokenAddress;

    // Smart contract responsible of minting and issuing LP Tokens (is ERC20)
    constructor(address _xelaTokenAddress) ERC20("ETH XELA LP Token", "lpETHXELA") {
        require(_xelaTokenAddress != address(0), "TOKEN_ADDRESS_PASSED_IS_NULL");
        xelaTokenAddress = _xelaTokenAddress;
    }

    // Returns the balance of Xela Token held by 'this' contract
    function getXelaReserve() public view returns (uint256) {
        return ERC20(xelaTokenAddress).balanceOf(address(this));
    }

    // Allow a user to add liquidity to the exchange
    function addLiquidity(uint256 amountOfXela) external payable {

        uint256 xelaReserve = getXelaReserve();

        // If pools are empty, the first LP set the ratio of tokens
        if (xelaReserve == 0) {
            IERC20 xelaInst = ERC20(xelaTokenAddress);
            xelaInst.transferFrom(xelaTokenAddress, address(this), amountOfXela);
        }
        else {
            uint256 ethReserve = address(this).balance - msg.value;
            uint256 rightXelaAmount = (msg.value * xelaReserve) / ethReserve;
            require(amountOfXela >= rightXelaAmount, "INCORRECT_RATIO_OF_XELA_PROVIDED");
            IERC20 xelaInst = ERC20(xelaTokenAddress);
            xelaInst.transferFrom(xelaTokenAddress, address(this), rightXelaAmount);

        }
    }


}