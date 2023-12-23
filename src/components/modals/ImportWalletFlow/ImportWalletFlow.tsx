import { useCurrentWallet } from "@/contexts/CurrentWalletContext";
import { PublicWalletInfo } from "@/interfaces/wallet";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

interface ImportWalletFlowProps { 
  onCancel: () => void
}

export const ImportWalletFlow = ({ onCancel }: ImportWalletFlowProps) => {
  const { setCurrentWallet } = useCurrentWallet()
  const [step, setStep] = useState<number>(0)
  const [seedPhrase, setSeedPhrase] = useState<string>()
  const [password, setPassword] = useState<string>()
  const [wrongPhrase, setWrongPhrase] = useState<boolean>()
  
  const handleImportWallet = () => {
    if(!seedPhrase || !password) return
    invoke<string>('import_wallet', { password: password, seed_phrase: seedPhrase })
      .then((result: string) => {
        const resultJson: PublicWalletInfo = JSON.parse(result)
        setCurrentWallet(resultJson)
      })
      .catch((error: any) => {
        setWrongPhrase(true)
      });
  }

  const clear = () => {
    setSeedPhrase(undefined)
    setPassword(undefined)
    setWrongPhrase(false)
    setStep(0)
  }

  const handleCancel = () => {
    clear()
    onCancel()
  }

  const handleNextStep = () => {
    //TODO: Should verify if seed phrase is compatible
    if (!seedPhrase) return
    setStep(1)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-center">
        {!wrongPhrase && step == 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Import your phrase
            </h2>
            <p className="flex flex-col items-center text-gray-600 dark:text-gray-300 mb-8 gap-6">
              yout seed phrase will be encrypted by tour password
              <input
                key="seedphrase"
                className="w-full p-2 rounded-lg text-black"
                type="text" 
                placeholder="seed phrase"
                onChange={(e) => setSeedPhrase(e.target.value)}
              />
            </p>
            <div className="flex justify-between items-center">
              <button 
                onClick={handleCancel}
                className="bg-transparent hover:bg-gray-200 text-gray-800 dark:text-white py-2 px-4 border border-gray-400 rounded shadow"
              >
                Cancel
              </button>
              <button 
                onClick={handleNextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
              >
                Continue
              </button>
            </div>
          </>
        ) : step == 1 && !wrongPhrase && (
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
            <div className="flex justify-between items-center">
              <button 
                onClick={handleCancel}
                className="bg-transparent hover:bg-gray-200 text-gray-800 dark:text-white py-2 px-4 border border-gray-400 rounded shadow"
              >
                Cancel
              </button>
              <button 
                onClick={handleImportWallet}
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
              >
                Go to dashboard
              </button>
            </div>
          </>
        )}
        {wrongPhrase && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Wrong Phrase
            </h2>
            <p className="flex flex-col items-center text-gray-600 dark:text-gray-300 mb-8 gap-6">
              Your seed phrase is wrong
            </p>
            <button 
              onClick={clear}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
