interface CreateWalletWarningProps {
  onCancel: () => void
  onContinue: () => void
}
export const CreateWalletWarning = ({ onCancel, onContinue }: CreateWalletWarningProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Keep Your Phrase Safe
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Never share your secret phrase.<br />
        Anyone with your phrase can access your funds.
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-8 italic">
        View this in private with no cameras around
      </p>
      <div className="flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="bg-transparent hover:bg-gray-200 text-gray-800 dark:text-white py-2 px-4 border border-gray-400 rounded shadow"
        >
          Cancel
        </button>
        <button 
          onClick={onContinue}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        >
          Set Password
        </button>
      </div>
    </>
  )
}