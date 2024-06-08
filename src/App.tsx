import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

import { useConnect } from "./hooks";
import { useToken } from "./hooks/useToken";

export function App () {

  const [ stakeInput, setStakeInput ] = useState<string>("");
  const [ loading, setLoading ] = useState(true);

  const { address, isConnected } = useAccount();
  const { useEthersSigner } = useConnect()

  const provider = useEthersSigner();
  const { jamToken, tokenFarm, balances, initBalances } = useToken()

  const handleStateInput = (value: string) => {
    const justNumbers = new RegExp("^[0-9,$]*$");
    if (justNumbers.test(value)) {
      setStakeInput(value);
    }
  };

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      window.alert("¡Deberías considerar usar Metamask!");
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    initBalances();
    setLoading(false)
  }, [isConnected, provider, address]);

  const stakeTokens = async () => {
    if (jamToken && tokenFarm && address) {
      setLoading(true);
      const amount = ethers.utils.parseUnits(stakeInput, "ether");
      try {
        const approveTx = await jamToken.approve(tokenFarm.address, amount);
        await approveTx.wait(); // Wait for the approval transaction to be mined

        const stakeTx = await tokenFarm.stakeTokens(amount);
        await stakeTx.wait(); // Wait for the stake transaction to be mined

        initBalances()
        setStakeInput("")
        setLoading(false);
      } catch (error) {
        console.error("Error staking tokens:", error);
        setLoading(false);
      }
    }
  };

  const unstakeTokens = async () => {
    if (tokenFarm && address) {
      setLoading(true);
      try {
        const unstakeTx = await tokenFarm.unstakeTokens();
        await unstakeTx.wait(); // Wait for the unstake transaction to be mined

        initBalances()
        setStakeInput("")
        setLoading(false);
      } catch (error) {
        console.error("Error unstaking tokens:", error);
        setLoading(false);
      }
    }
  };

  return (
    <section className="w-full h-screen flex flex-col gap-5 justify-center items-center">
      <h1 className="text-[#242422] tracking-wider text-5xl font-bold">
        MAKE YOUR STAKING!
      </h1>
      {loading ? (
        <p className="text-[#242422] tracking-wider text-xl font-bold flex flex-col justify-center items-center">
          Cargando...
        </p>
      ) : (
        <div className="w-[30rem] py-16 flex flex-col gap-2 justify-center items-center bg-[#FDFBF6] border border-[#242422] rounded-lg">
          <div className="w-[20.5rem]">
            <div className="w-full flex justify-between items-center mb-10 p-2 border border-[#242422] rounded-lg">
              <p className="text-[#242422] tracking-wider text-xl font-bold flex flex-col justify-center items-center">
                In staking
                <span className="font-normal">{balances.stakingBalance}</span>
              </p>

              <p className="text-[#242422] tracking-wider text-xl font-bold flex flex-col justify-center items-center">
                Reward
                <span className="font-normal">
                  {balances.stellartTokenBalance}
                </span>
              </p>
            </div>
            {balances.jamTokenBalance && (
              <p className="w-full tracking-wider text-xl flex justify-end font-normal">
                Balance: {balances.jamTokenBalance} JAM
              </p>
            )}
            <input
              type="text"
              className="p-2 w-full outline-none bg-transparent border border-[#242422] tracking-wider text-base font-normal rounded-md"
              value={stakeInput}
              placeholder="0"
              onChange={(e) => handleStateInput(e.target.value)}
            />
          </div>
          <div className="flex justify-center gap-2 pt-3 items-center">
            <button
              type="button"
              onClick={stakeTokens}
              className="min-w-[10rem] py-2 tracking-wider bg-[#242422] text-[#FDFBF6] text-base font-normal rounded-md"
            >
              Stake!
            </button>
            <button
              type="button"
              onClick={unstakeTokens}
              className="min-w-[10rem] py-2 tracking-wider bg-transparent border border-[#242422] text-[#242422] text-base font-normal rounded-md"
            >
              Unstake!
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default App;
