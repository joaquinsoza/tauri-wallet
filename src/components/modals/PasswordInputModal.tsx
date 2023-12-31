import { useState } from "react"

interface PasswordInputModalProps { 
  onCancel: () => void
  onContinue: (password:string) => void
}

export const PasswordInputModal = ({ onCancel, onContinue }: PasswordInputModalProps) => {
  const [password, setPassword] = useState<string>()
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleOnContinue = () => {
    
    try {
      if (!password) throw "Please enter a password"
      onContinue(password)
      onCancel()
    } catch (error) {
      setErrorMessage(error as string)
    }
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
            onClick={handleOnContinue}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          >
            Login
          </button>
        </div>
        {errorMessage}
      </div>
    </div>
  );
}
