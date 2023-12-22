import { useState } from "react";
import { CreateWalletWarning } from "./Warning";
import { invoke } from "@tauri-apps/api/tauri";

interface CreateWalletFlowProps { 
  onCancel: () => void
}

export const CreateWalletFlow = ({ onCancel }: CreateWalletFlowProps) => {
  const [showWarning, setShowWarninig] = useState<boolean>(true)
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string>()
  const [showPasswordForm, setShowPasswordForm] = useState<boolean>(false)
  const [password, setPassword] = useState<string>()

  const handleViewSecret = (password: string | undefined) => {
    if (!password) return    
    invoke('create_new_wallet', { password: password, name: "ss" })
      .then((resp: any) => {
        // Handle the mnemonic, e.g., show it in the UI
        setShowPasswordForm(false)
        setMnemonicPhrase(resp)
        // ... set the mnemonic in the state to display it
      })
      .catch((error: any) => {
        // Handle errors, e.g., show an error message
        console.error('Error creating wallet:', error);
      });
  }

  const handleShowPasswordForm = () => {
    setShowPasswordForm(true)
    setShowWarninig(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-center">
        {showWarning && !mnemonicPhrase && (
          <CreateWalletWarning onCancel={onCancel} onContinue={handleShowPasswordForm} />
        )}
        {showPasswordForm && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Set a password
            </h2>
            <p className="flex flex-col items-center text-gray-600 dark:text-gray-300 mb-8 gap-6">
              This password is used to encrypt your key, we cannot help you recover it
              <input className="w-2/5 p-2 rounded-lg text-black" type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}></input>
            </p>
            <button 
              onClick={()=> handleViewSecret(password)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Reveal Secret
            </button>
          </>
        )}
        {mnemonicPhrase && !showWarning && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your secret phrase
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {mnemonicPhrase || "Generating..."}
            </p>
            <button 
              onClick={onCancel}
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
