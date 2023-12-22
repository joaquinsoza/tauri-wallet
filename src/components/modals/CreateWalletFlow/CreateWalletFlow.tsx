import { useState } from "react";
import { CreateWalletWarning } from "./Warning";
import { invoke } from "@tauri-apps/api/tauri";

interface CreateWalletFlowProps { 
  onCancel: () => void
}

export const CreateWalletFlow = ({ onCancel }: CreateWalletFlowProps) => {
  const [showWarning, setShowWarninig] = useState<boolean>(true)
  const [showSecret, setShowSecret] = useState<boolean>(false)
  const [mnemonicPhrase, setMnemonicPhrase] = useState<string>()

  const handleViewSecret = () => {
    invoke('create_wallet')
      .then((resp: any) => {
        console.log(resp)
        // Handle the mnemonic, e.g., show it in the UI
        setMnemonicPhrase("resp")
        setShowSecret(true);
        setShowWarninig(false);
        // ... set the mnemonic in the state to display it
      })
      .catch((error: any) => {
        // Handle errors, e.g., show an error message
        console.error('Error creating wallet:', error);
      });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-center">
        {showWarning && !showSecret && (
          <CreateWalletWarning onCancel={onCancel} onViewSecretPhrase={handleViewSecret} />
        )}
        {showSecret && !showWarning && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {mnemonicPhrase || "Generating..."}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              secret phrase should go here
            </p>
            <button 
              onClick={onCancel}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
            >
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
