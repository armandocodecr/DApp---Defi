// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "./JamToken.sol";
import "./StellartToken.sol";

// Owner: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// Usuario: 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2

contract TokenFarm {
    // Declaraciones iniciales
    string public name = "Stellart Token Farm";
    address public owner;
    JamToken public jamToken;
    StellartToken public stellarToken;

    // Estructura de datos
    address [] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(StellartToken _stellarToken, JamToken _jamToken){
        stellarToken = _stellarToken;
        jamToken = _jamToken;
        owner = msg.sender;
    }

    // Stake de tokens
    function stakeTokens(uint _amount) public {
        // Se require una cantidad superior a cero
        require(_amount > 0, "La cantidad no puede ser menor a 0");
        // Transferir tokens JAM al smart contract principal
        jamToken.transferFrom((msg.sender), address(this), _amount);
        // Actualizar el saldo del staking
        stakingBalance[msg.sender] += _amount;
        // Guardar el staker
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Actualizar el estado del staking
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Quitar el staking de los tokens
    function unstakeTokens() public {
        // Saldo del staking de un usuario
        uint balance = stakingBalance[msg.sender];
        // Se require una cantidad superior a 0
        require(balance > 0, "El balance staking es 0");
        // Transferencia de los tokens al usuario
        jamToken.transfer(msg.sender, balance);
        // Resetea el balance de staking del usuario
        stakingBalance[msg.sender] = 0;
        // Actualizar el estado del staking
        isStaking[msg.sender] = false;
    }

    // Emision de Tokens (recompensas)
    function issuesTokens() public{
        // Unicamente ejecutable por el owner
        require(msg.sender == owner, "No eres el owner");
        // Emitir tokens a todos los stakers
        for(uint i=0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                stellarToken.transfer(recipient, balance);
            }
        }

    }

}