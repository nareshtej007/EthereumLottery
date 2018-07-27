const assert = require('assert');// this is part of node library no need to install
const ganache = require('ganache-cli'); // ganache is local test network this only created when test file starts
const Web3 = require('web3');// First we are requiring constructor function Web3
const web3 = new Web3(ganache.provider());// Provider is a replaceable little block that we stick into web3 library, the provider allow us to connect with any given network

const { interface, bytecode } = require('../compile'); //Here we are requiring object that has interface and bytecode property

let lottery;// this holds our instace of contract
let accounts;// this variable holds all account addresses

beforeEach(async () => {  //it deploys contract and also gives list of accounts
 
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
       .deploy({data : bytecode}) //bytecode is raw compiled contract
       .send({ from: accounts[0], gas: '1000000'});
});

describe('Lottery Contract', () => {  //to test multiple functions at a time
    it('deploys a contract', () => {
     assert.ok(lottery.options.address);
    });

    it ('Allows one account to enter', async () =>{
        await lottery.methods.enter().send({
             from: accounts[0],
             value: web3.utils.toWei('0.02', 'ether') //it converts ehters to wei internally, you can give wei ammout also directly but it is huge number ERROR: here W must be capital

            });
    

    const players = await lottery.methods.getPlayers().call({ 
        from: accounts[0]
    
});
    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length)
});

it ('Allows multiple accounts to enter', async () => {
    await lottery.methods.enter().send({
         from: accounts[0],
         value: web3.utils.toWei('0.02', 'ether') //it converts ehters to wei internally, you can give wei ammout also directly but it is huge number ERROR: here W must be capital

        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.03', 'ether') //it converts ehters to wei internally, you can give wei ammout also directly but it is huge number ERROR: here W must be capital
   
           });
           await lottery.methods.enter().send({
                from: accounts[2],
                value: web3.utils.toWei('0.04', 'ether') //it converts ehters to wei internally, you can give wei ammout also directly but it is huge number ERROR: here W must be capital
       
               });

const players = await lottery.methods.getPlayers().call({ 
    from: accounts[0]

});
assert.equal(accounts[0], players[0]);
assert.equal(accounts[1], players[1]);
assert.equal(accounts[2], players[2]);

assert.equal(3, players.length)
});

it('requires a minimum amount of ether to enter', async () => {
    try{
    await lottery.methods.enter().send({
        from: account[0],
        value: 0 // 200 means Wei , here we are not specifuing any ehters in it and convert it 
    }); //this call should thow an error to end this function
    assert(false);// It always fails.
} catch (err) {
    assert(err);// ASSERT is used to check the truthy ness
}
});
it('only manager can call pickWinner', async () => {
  try{
  await lottery.methods.pickWinner().send({
      from: accounts[1]
  });

  }catch(err){
      assert(err);
  }

});

it('sends money to the winner and resets the players array', async () => {
    await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei('2' , 'ether')
    });
    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({ from: accounts[0]});

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    
    assert(difference > web3.utils.toWei('1.8', 'ether'));
});
});