//What behavior do you really give to this contract
pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;//here dynamic array is address and anyone can see the address of others
    
     function Lottery() public {
         manager = msg.sender ;
     }
    
    function enter() public restricted payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() public view restricted returns(uint) {
        return uint(keccak256(block.difficulty, now, players));//here block is a global variable we can call it any time
    }// "now" is also global variable(time) and above line generate hexadecimal number then we have to convert it as integer
    
    function pickWinner() public {
        //require(msg.sender == manager);
        
        uint index = random() % players.length;
        players[index].transfer(this.balance);// this keyword specifies all the money present in the current contract
        players = new address[](0);
    }
    
    modifier restricted() { // the modifer function we can use when ever we need to add validation logic inside our smart contract
        require(msg.sender == manager);
        _;// this specifies the 24,25,26 lines of code
    }
    
    function getPlayers() public view returns(address[]) {
        return players;
    }
}