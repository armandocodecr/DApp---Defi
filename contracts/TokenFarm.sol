// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./JamToken.sol";
import "./StellartToken.sol";

contract TokenFarm {
    // Initial declarations
    string public name = "Stellart Token Farm";
    address public owner;
    JamToken public jamToken;
    StellartToken public stellarToken;

    // Data structure
    address [] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(StellartToken _stellarToken, JamToken _jamToken){
        stellarToken = _stellarToken;
        jamToken = _jamToken;
        owner = msg.sender;
    }

    // Staking tokens
    function stakeTokens(uint _amount) public {
        // Require an amount greater than zero
        require(_amount > 0, "Amount cannot be less than 0");
        // Transfer JAM tokens to the main smart contract
        jamToken.transferFrom((msg.sender), address(this), _amount);
        // Update the staking balance
        stakingBalance[msg.sender] += _amount;
        // Save the staker
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update the staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Unstake tokens
    function unstakeTokens() public {
        // Staking balance of a user
        uint balance = stakingBalance[msg.sender];
        // Require a balance greater than 0
        require(balance > 0, "Staking balance is 0");
        // Transfer tokens back to the user
        jamToken.transfer(msg.sender, balance);
        // Reset the user's staking balance
        stakingBalance[msg.sender] = 0;
        // Update the staking status
        isStaking[msg.sender] = false;
    }

    // Issuing tokens (rewards)
    function issuesTokens() public{
        // Only executable by the owner
        require(msg.sender == owner, "You are not the owner");
        // Issue tokens to all stakers
        for(uint i=0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                stellarToken.transfer(recipient, balance);
            }
        }
    }
}
