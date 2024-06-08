import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from 'wagmi';

import { ContractBalance } from "../interfaces/Balances";

import { useConnect } from "./useConnect";

import addresses from "../contracts/addresses.json";

import JamToken from "../../artifacts/contracts/JamToken.sol/JamToken.json";
import StellartToken from "../../artifacts/contracts/StellartToken.sol/StellartToken.json";
import TokenFarm from "../../artifacts/contracts/TokenFarm.sol/TokenFarm.json";

export function useToken(){
    const { address, isConnected } = useAccount()

    const { useEthersSigner } = useConnect()
    const provider = useEthersSigner();

    const [jamToken, setJamToken] = useState<ethers.Contract | null>(null);
    const [stellartToken, setStellartToken] = useState<ethers.Contract | null>(null);
    const [tokenFarm, setTokenFarm] = useState<ethers.Contract | null>(null);
    const [balances, setBalances] = useState<ContractBalance>({
        jamTokenBalance: "0",
        stellartTokenBalance: "0",
        stakingBalance: "0",
    });

    const initBalances = async () => {
        if (isConnected && provider) {
          const signer = provider;
    
          const jamToken = new ethers.Contract(
            addresses.JamToken,
            JamToken.abi,
            signer
          );
          handleJamTokenState(jamToken);
    
          const stellartToken = new ethers.Contract(
            addresses.StellartToken,
            StellartToken.abi,
            signer
          );
          handleStellartTokenState(stellartToken);
    
          const tokenFarm = new ethers.Contract(
            addresses.TokenFarm,
            TokenFarm.abi,
            signer
          );
          handleFarmTokenState(tokenFarm);
    
          const jamTokenBalance = await jamToken.balanceOf(address);
          const stellartTokenBalance = await stellartToken.balanceOf(address);
          const stakingBalance = await tokenFarm.stakingBalance(address);
    
          handleContractBalance({
            jamTokenBalance: ethers.utils.formatEther(jamTokenBalance),
            stellartTokenBalance: ethers.utils.formatEther(stellartTokenBalance),
            stakingBalance: ethers.utils.formatEther(stakingBalance),
          });
        }
      };

    const handleJamTokenState = ( value: ethers.Contract | null ) => {
        setJamToken(value)
    }

    const handleStellartTokenState = ( value: ethers.Contract | null ) => {
        setStellartToken(value)
    }

    const handleFarmTokenState = ( value: ethers.Contract | null ) => {
        setTokenFarm(value)
    }

    const handleContractBalance = ( values: ContractBalance ) => {
        setBalances(values)
    }

    return {
        // Variables
        jamToken,
        stellartToken,
        tokenFarm,
        balances,

        //Function
        handleJamTokenState,
        handleStellartTokenState,
        handleFarmTokenState,
        handleContractBalance,
        initBalances,
    }

}