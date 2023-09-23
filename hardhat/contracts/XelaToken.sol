// SPDX-License-Identifier: MIT

//==================================================>
    // Realised by Alexandre Sanson the 09/23/2023
    // Inspired from learnweb3.io
//==================================================>

/*
    This contract is a very basic ERC-20 that just mints a million tokens to the deployer address.   

    Smart Contract Adress on Sepolia testnet : 
    https://sepolia.etherscan.io/ : 

*/
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XelaToken is ERC20 {
    // Mint 1 million Xela Tokens for the smart contract creator
    constructor() ERC20("XelaToken", "XLT") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}