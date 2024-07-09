// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract StellartToken {
    // Declarations
    string public name = "Stellar Token";
    string public symbol = "STE";
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    // Events for token transfer between users
    event Transfer (
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Event for operator approval
    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint256 value
    );

    // Data structure
    mapping(address => uint256) public balanceOf; // Get the balance of an address
    mapping(address => mapping(address => uint)) public allowance; // Amount allowed for a spender to manage on behalf of the owner

    // Constructor
    constructor(){
        balanceOf[msg.sender] = totalSupply; // When the contract is deployed, the total supply goes to the msg.sender
    }

    // Token transfer between users
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Approval of an amount to be spent by an operator
    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value; // [msg.sender] -> token owner | [_spender] -> person allowed to spend the tokens
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Token transfer specifying the sender
    // Owner (20 tokens) -> Operator (5 tokens) = 15 tokens
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){ // Allows transferring tokens on behalf of another person if approved
        require(_value <= balanceOf[_from]); // Check if the sender has enough balance
        require(_value <= allowance[_from][msg.sender]); // Check if the tokens have been approved correctly for the sender (msg.sender)

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
