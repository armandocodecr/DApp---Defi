import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import JamToken from '../artifacts/contracts/JamToken.sol/JamToken.json';

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [jamToken, setJamToken] = useState<ethers.Contract | null>(null);
  const [stakeInput, setStakeInput] = useState<string>("0");
  const [balance, setBalance] = useState<string | null>(null);

  const justNumbers = new RegExp('^[0-9,$]*$');

  const handleStateInput = (value: string) => {
    if (justNumbers.test(value)) {
      setStakeInput(value);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        // Solicitar acceso a la cuenta
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Verificar que window.ethereum esté disponible
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();

        // Asegurarse de que estamos en la red correcta
        if (network.chainId === 1337) {
          const signer = provider.getSigner();

          // Obtener la cuenta
          const account = await signer.getAddress();
          setAccount(account);

          // Obtener la instancia del contrato
          const jamToken = new ethers.Contract(
            '0x0a88BDA3DE97195Ab5c2550EB3dE41E7AbEE8948', // Reemplaza con la dirección de tu contrato
            JamToken.abi,
            signer
          );
          setJamToken(jamToken);

          // Obtener el balance
          const balance = await jamToken.balanceOf(account);
          setBalance(ethers.utils.formatEther(balance));
        } else {
          console.error("Conéctate a la red de Ganache (ID: 1337)");
        }
      } else {
        console.error("MetaMask no está instalado");
      }
    };

    init();
  }, []);

  return (
    <section className='w-full h-screen flex flex-col gap-5 justify-center items-center'>
      <h1 className='text-[#242422] tracking-wider text-5xl font-bold'>MAKE YOUR STAKING!</h1>
      <div className="w-[20rem] h-[20rem] flex flex-col gap-2 justify-center items-center bg-[#FDFBF6] border border-[#242422] rounded-lg">
        {balance && <p className='tracking-wider text-xl font-normal'>Balance: {balance} ACM</p>}
        <input 
          type="text" 
          className='p-2 outline-none bg-transparent border border-[#242422] tracking-wider text-base font-normal rounded-md'
          value={stakeInput}
          onChange={(e) => handleStateInput(e.target.value)} 
        />
        <div className="flex justify-center gap-2 pt-3 items-center">
          <button type="button" className='min-w-[6rem] py-2 tracking-wider bg-[#242422] text-[#FDFBF6] text-base font-normal rounded-md'>Stake!</button>
          <button type="button" className='min-w-[6rem] py-2 tracking-wider bg-transparent border border-[#242422] text-[#242422] text-base font-normal rounded-md'>Unstake!</button>
        </div>
      </div>
    </section>
  );
}

export default App;
