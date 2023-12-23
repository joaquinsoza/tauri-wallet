import { useCurrentWallet } from "@/contexts/CurrentWalletContext"

export const Dashboard = () => {
  const {currentWallet} = useCurrentWallet()
  return (
    <div>
      <div className="bg-red-400 p-4">
        {currentWallet?.address}
      </div>
      <div className="bg-red-600 p-4">
        {currentWallet?.name}
      </div>
      <div className="bg-red-800 p-4">
        {currentWallet?.uuid}
      </div>
    </div>
  )
}