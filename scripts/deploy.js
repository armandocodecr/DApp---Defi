import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { ethers } from 'hardhat';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const JamToken = await ethers.getContractFactory("JamToken");
  const jamToken = await JamToken.deploy();
  await jamToken.deployed();
  console.log("JamToken deployed to:", jamToken.address);

  const StellartToken = await ethers.getContractFactory("StellartToken");
  const stellartToken = await StellartToken.deploy();
  await stellartToken.deployed();
  console.log("StellartToken deployed to:", stellartToken.address);

  const TokenFarm = await ethers.getContractFactory("TokenFarm");
  const tokenFarm = await TokenFarm.deploy(stellartToken.address, jamToken.address);
  await tokenFarm.deployed();
  console.log("TokenFarm deployed to:", tokenFarm.address);

  // Transferir StellartTokens a TokenFarm (1 millón de tokens)
  await stellartToken.transfer(tokenFarm.address, ethers.utils.parseUnits('1000000', 18));
  console.log('Transferred 1M StellartTokens to TokenFarm');

  // Transferir JamTokens a la cuenta de MetaMask
  const metamaskAddress = '0xa14C5017c5b3d5b03A96d94e07A3B200D6085085'; // Reemplaza con la dirección de tu cuenta de MetaMask
  await jamToken.transfer(metamaskAddress, ethers.utils.parseUnits('10000', 18));
  console.log(`Transferred 100 JamTokens to account: ${metamaskAddress}`);

  // Verificar balance
  const balance = await jamToken.balanceOf(metamaskAddress);
  console.log(`Balance of ${metamaskAddress}: ${ethers.utils.formatUnits(balance, 18)} JAM`);

  // Guardar las direcciones del contrato en un archivo JSON
  const addresses = {
    JamToken: jamToken.address,
    StellartToken: stellartToken.address,
    TokenFarm: tokenFarm.address,
  };

  const addressesPath = path.join(__dirname, '..', 'src', 'contracts', 'addresses.json');
  fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));

  console.log(`Contract addresses saved to ${addressesPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
