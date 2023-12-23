import { PublicWalletInfo } from "@/interfaces/wallet";
import { createContext, useContext, useState, ReactNode } from "react";

interface CurrentWalletContextType {
  currentWallet: PublicWalletInfo | null;
  setCurrentWallet: (wallet: PublicWalletInfo | null) => void;
}

const CurrentWalletContext = createContext<CurrentWalletContextType>({
  currentWallet: null,
  setCurrentWallet: () => {},
});

export function useCurrentWallet() {
  return useContext(CurrentWalletContext);
}

interface CurrentWalletProviderProps {
  children: ReactNode;
}

export const CurrentWalletProvider: React.FC<CurrentWalletProviderProps> = ({ children }) => {
  const [currentWallet, setCurrentWallet] = useState<PublicWalletInfo | null>(null);

  const contextValue = {
    currentWallet,
    setCurrentWallet,
  };

  return (
    <CurrentWalletContext.Provider value={contextValue}>
      {children}
    </CurrentWalletContext.Provider>
  );
};
