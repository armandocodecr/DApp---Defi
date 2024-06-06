// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract StellartToken {
    // Declaraciones
    string public name = "Stellar Token";
    string public symbol = "STE";
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    // Eventos para la transferencia de tokens de un usuario
    event Transfer (
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Evento para la aprobacion de un operador
    event Approval (
        address indexed _owner,
        address indexed _spender,
        uint256 value
    );

    // Estructura de datos
    mapping(address => uint256) public balanceOf; // Obtener el balance de una persona
    mapping(address => mapping(address => uint)) public allowance; // Cantidad que permitemos que un spender gestione sobre nuestros tokens

    // Constructor
    constructor(){
        balanceOf[msg.sender] = totalSupply; // Cuando se despliega el contrato el balance total se irá directamente al msg.sender
    }

    // Transferencia de tokens de un usuario
    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // Aprobacion de una cantidad para ser gastada por un operador
    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value; // [msg.sender] -> dueño de los tokens | [_spender] -> persona a la que se le da permisos de usarlos
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transferencia de Tokens especificando el emisor
    // Owner (20 tokens) -> Operador (5 tokens) = 15 tokens
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){ // Nos permite enviar tokens de otra persona si tenemos permisos
        require(_value <= balanceOf[_from]); // Comprobamos que el balance de la persona que envia tenga dicha cantidad disponible para hacerlo
        require(_value <= allowance[_from][msg.sender]); // Compruebo que los tokens del emisor (_from -> dueño) hayan sido emitidos correctamente a la 
        // persona que está enviando dichos tokens (msg.sender)

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

}