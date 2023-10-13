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

    // Allow users to add liquidity to the exchange
    function addLiquidity(uint256 amountOfXela) external payable returns(uint256){

        IERC20 xelaInst = ERC20(xelaTokenAddress);

        uint256 xelaReserve = getXelaReserve();
        uint256 ethReserve  = address(this).balance; 
        uint256 lpTokenToMint;

        // If pools are empty, the first LP set the ratio of tokens
        if (xelaReserve == 0) {
            // Transfer Xela from the user to the Exchange
            xelaInst.transferFrom(msg.sender, address(this), amountOfXela);

            // Mint LP Token to the user
            lpTokenToMint = ethReserve; // = msg.value
            _mint(msg.sender, lpTokenToMint);

            return lpTokenToMint;
        }

        // If pools are not empty, calculate the right amount of Token to get the same pool ratio
        uint256 ethReservePriorToFunctionCall = ethReserve - msg.value;
        uint256 rightXelaAmount = (msg.value * xelaReserve) / ethReservePriorToFunctionCall;
        require(amountOfXela >= rightXelaAmount, "INSUFFICIENT_AMOUNT_OF_XELA_PROVIDED");

        // Transfer Xela from the user to the Exchange
        xelaInst.transferFrom(msg.sender, address(this), rightXelaAmount);

        // Calculate and mint the amount of LP Token for the user
        lpTokenToMint = (msg.value * totalSupply()) / ethReservePriorToFunctionCall;
        _mint(msg.sender, lpTokenToMint);

        return lpTokenToMint;
    }


}