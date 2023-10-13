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

    // Allow users to remove liquidity from exchange and get back its tokens
    function removeLiquidity(uint256 amountOfLpTokens) external returns(uint256, uint256) {
        
        require(amountOfLpTokens > 0, "AMOUNT_OF_TOKENS_TO_REMOVE_MUST_BE_GREATER_THAN_0");

        uint256 totalLpTokenSupply = totalSupply();
        uint256 xelaReserve = getXelaReserve();
        uint256 ethReserve  = address(this).balance;

        // Calculate the amount of ETH and XELA to return to the user
        uint256 ethToReturn  = ethReserve * (amountOfLpTokens / totalLpTokenSupply);
        uint256 xelaToReturn = xelaReserve * (amountOfLpTokens / totalLpTokenSupply);


        // _burn() verifies that msg.sender has a sufficient amount of LP Token
        _burn(msg.sender, amountOfLpTokens);
        // Transfer ETH and XELA to the user
        payable(msg.sender).transfer(ethToReturn);
        ERC20(xelaTokenAddress).transfer(msg.sender, xelaToReturn);

        return (ethToReturn, xelaToReturn);
    }

    // Calculates the amount of output tokens to be received based on the equation 
    // x * y = (x + dx)(y - dy) 
    function getOutputAmountFromSwap(
        uint256 xReserve,
        uint256 yReserve,
        uint256 xAdded
    ) public pure returns(uint256) {

        require(xReserve > 0 && yReserve > 0, "RESERVES_MUST_BE_GREATER_THAN_0");

        uint256 xAddedWithFees = xAdded * 99;

        uint256 numerator = (yReserve * xAddedWithFees);
        uint256 denominator = (xReserve * 100) + xAddedWithFees;

        return numerator / denominator;
    }


}