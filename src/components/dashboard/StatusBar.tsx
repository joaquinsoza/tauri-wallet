import { useCurrentWallet } from "@/contexts/CurrentWalletContext"
import ProfileCover from "@/assets/profileCover.svg"
import { useEthereum } from "@/contexts/EthereumContext"
import { useEffect, useState } from "react"
import { Network } from "ethers"

export const StatusBar = () => {
  const { blockNumber, provider } = useEthereum()

  const [currentNetwork, setCurrentNetwork] = useState<Network | undefined>()
  useEffect(() => {
    const getCurrentNetwork = async () => {
      const network = await provider?.getNetwork()
      setCurrentNetwork(network)
    }
    getCurrentNetwork()
  }, [provider])

  return (
    <div className="absolute bottom-0 w-full bg-purple-950 flex justify-between px-2">
      <div>
        {currentNetwork?.name}
      </div>
      {blockNumber !== null ? (
        <p>{blockNumber}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}