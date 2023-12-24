import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useCurrentWallet } from './CurrentWalletContext';
import { getWalletBalance } from '@/utils/ethers';

interface EthereumContextType {
  provider: ethers.Provider | null;
  blockNumber: number | null;
  balance: string | null;
}

const EthereumContext = createContext<EthereumContextType>({
  provider: null,
  blockNumber: null,
  balance: null,
});

interface EthereumProviderProps {
  children: React.ReactNode;
}

export const EthereumProvider: React.FC<EthereumProviderProps> = ({ children }) => {
  const { currentWallet } = useCurrentWallet();
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const newProvider = new ethers.WebSocketProvider(`wss://goerli.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`);
    setProvider(newProvider);

    newProvider.on("block", (newBlockNumber) => {
      setBlockNumber(newBlockNumber);
      if (currentWallet?.address) {
        getWalletBalance(newProvider, currentWallet.address).then((balance) => setBalance(balance))
      }
    });

    if (currentWallet?.address) {
      getWalletBalance(newProvider, currentWallet.address).then((balance) => setBalance(balance))
    }

    return () => {
      newProvider.removeAllListeners("block");
    };
  }, [currentWallet]);

  return (
    <EthereumContext.Provider value={{ provider, blockNumber, balance }}>
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => useContext(EthereumContext);
