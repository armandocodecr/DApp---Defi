const JamToken = artifacts.require('JamToken');
const StellartToken = artifacts.require('StellartToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {
  // Deploy JamToken
  await deployer.deploy(JamToken);
  const jamToken = await JamToken.deployed();
  console.log('JamToken deployed at', jamToken.address);

  // Deploy StellartToken
  await deployer.deploy(StellartToken);
  const stellartToken = await StellartToken.deployed();
  console.log('StellartToken deployed at', stellartToken.address);

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, stellartToken.address, jamToken.address);
  const tokenFarm = await TokenFarm.deployed();
  console.log('TokenFarm deployed at', tokenFarm.address);

  // Transfer StellartTokens to TokenFarm (1 million tokens)
  await stellartToken.transfer(tokenFarm.address, '100000000000000000000');
  console.log('Transferred 1M StellartTokens to TokenFarm');

  // Transfer JamTokens to the second account (for staking)
  await jamToken.transfer(accounts[1], '100000000000000000000');
  await jamToken.transfer('0xa14C5017c5b3d5b03A96d94e07A3B200D6085085', '10000');
  console.log({TokenFarm})
  console.log('Transferred 100 JamTokens to account:', accounts[1]);
};
