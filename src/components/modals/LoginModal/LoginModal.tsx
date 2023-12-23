import { useCurrentWallet } from "@/contexts/CurrentWalletContext";
import { PublicWalletInfo } from "@/interfaces/wallet";
import { loginIntoWallet } from "@/utils/tauri";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

interface LoginModalProps { 
  onCancel: () => void
  selectedWallet: PublicWalletInfo
}

export const LoginModal = ({ onCancel, selectedWallet }: LoginModalProps) => {
  const { setCurrentWallet } = useCurrentWallet()
  const [password, setPassword] = useState<string | undefined>(undefined)

  const handleLoginSubmit = () => {
    if (!password) return    
    loginIntoWallet(password, selectedWallet.uuid)
      .then((resp: PublicWalletInfo | null) => setCurrentWallet(resp))
      .catch((error) => console.log(error))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Enter Password
        </h2>
        <input
          key="wallet_password"
          className="p-2 w-3/4 rounded-lg text-black"
          type="password" 
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-between items-center gap-10">
          <button 
            onClick={onCancel}
            className="bg-transparent hover:bg-gray-200 text-gray-800 dark:text-white py-2 px-4 border border-gray-400 rounded shadow"
          >
            Cancel
          </button>
          <button 
            onClick={handleLoginSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
