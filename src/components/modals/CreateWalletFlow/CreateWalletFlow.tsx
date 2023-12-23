import { useEffect, useState } from "react";
import { CreateWalletWarning } from "./Warning";
import { invoke } from "@tauri-apps/api/tauri";
import { loginIntoWallet } from "@/utils/tauri";
import { PublicWalletInfo, WalletCreationResponse } from "@/interfaces/wallet";
import { useCurrentWallet } from "@/contexts/CurrentWalletContext";

interface CreateWalletFlowProps { 
  onCancel: () => void
}

export const CreateWalletFlow = ({ onCancel }: CreateWalletFlowProps) => {
  const {setCurrentWallet} = useCurrentWallet()
  const [showWarning, setShowWarninig] = useState<boolean>(true)
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string>()
  const [step, setStep] = useState<number>(0)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [walletName, setWalletName] = useState<string | undefined>(undefined)
  const [newUuid, setNewUuid] = useState<string | undefined>(undefined)
  const handleViewSecret = () => {
    if (!password || !walletName) return    
    invoke<string>('create_new_wallet', { password: password, name: walletName })
      .then((result: string) => {
        const resultJson: WalletCreationResponse = JSON.parse(result)
        // Handle the mnemonic, e.g., show it in the UI
        setStep(3)
        setMnemonicPhrase(resultJson.mnemonic)
        setNewUuid(resultJson.uuid)
        // ... set the mnemonic in the state to display it
      })
      .catch((error: any) => {
        // Handle errors, e.g., show an error message
        console.error('Error creating wallet:', error);
      });
  }

  const handleShowPasswordForm = () => {
    setStep(1)
    setShowWarninig(false)
  }

  const handleClose = () => {
    setWalletName(undefined)
    setPassword(undefined)
    setStep(0)
    onCancel()

    loginIntoWallet(password!, newUuid!)
      .then((resp: PublicWalletInfo | null) => setCurrentWallet(resp))
      .catch((error) => console.log(error))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-center">
        {step == 0 && showWarning && !mnemonicPhrase && (
          <CreateWalletWarning onCancel={onCancel} onContinue={handleShowPasswordForm} />
        )}
        {step == 1 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Set a name
            </h2>
            <p className="flex flex-col items-center text-gray-600 dark:text-gray-300 mb-8 gap-6">
              You can have multiple wallets, set a name for this one
              <input
                key="wallet_name"
                className="w-2/5 p-2 rounded-lg text-black"
                type="text" 
                placeholder="Wallet name"
                onChange={(e) => setWalletName(e.target.value)}
              />
            </p>
            <button 
              onClick={() => setStep(2)}
              disabled={!walletName}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded disabled:bg-gray-600"
            >
              Continue
            </button>
          </>
        ) : step == 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Set a password
            </h2>
            <p className="flex flex-col items-center text-gray-600 dark:text-gray-300 mb-8 gap-6">
              This password is used to encrypt your key, we cannot help you recover it
                <input
                  key="wallet_password"
                  className="w-2/5 p-2 rounded-lg text-black"
                  type="password"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
            </p>
            <button 
              onClick={() => handleViewSecret()}
              disabled={!password}  
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded disabled:bg-gray-600"
            >
              Continue
            </button>
          </>
        )}
        {step == 3 && mnemonicPhrase && !showWarning && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your secret phrase
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {mnemonicPhrase || "Generating..."}
            </p>
            <button 
              onClick={handleClose}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Go to dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
