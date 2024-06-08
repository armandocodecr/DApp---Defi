import hre from 'hardhat';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Leer la dirección del contrato desde el archivo addresses.json
  const addressesPath = path.join(__dirname, '..', 'src', 'contracts', 'addresses.json');
  console.log({ addressesPath })
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));

  // Obtener la implementación del contrato TokenFarm
  const tokenFarm = await hre.ethers.getContractAt("TokenFarm", addresses.TokenFarm);

  // Emitir los tokens de recompensa
  const tx = await tokenFarm.issuesTokens();
  await tx.wait();

  console.log("The tokens have been emitted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
