import { useCurrentWallet } from "@/contexts/CurrentWalletContext"
import ProfileCover from "@/assets/profileCover.svg"
import Image from "next/image"
import { chooseRandomIcon } from "@/utils/chooseRandomIcon"
import { shortenAddress } from "@/utils/addresses"
import { useEthereum } from "@/contexts/EthereumContext"
import { useEffect, useState } from "react"

export const Header = () => {
  const { currentWallet, setCurrentWallet } = useCurrentWallet()
  const [profileIcon, setProfileIcon] = useState<string>('');
  const { balance } = useEthereum()

  const handleCopyAddress = async () => {
    if(!currentWallet?.address) return
    try {
      await navigator.clipboard.writeText(currentWallet?.address);
      console.log('Address copied to clipboard');
    } catch (err) {
      console.error('Failed to copy address to clipboard', err);
    }
  }

  const handleLogout = () => {
    setCurrentWallet(null)
  }

  useEffect(() => {
    setProfileIcon(chooseRandomIcon());
  }, []); 

  return (
    <div
      className="flex justify-between px-4 py-3 bg-cover"
      style={{ backgroundImage: `url(${ProfileCover.src})` }}
    >
      <div
        className="flex items-center bg-black/50 py-4 px-6 rounded-xl gap-4 mb-3 backdrop-blur-lg"
      >
        <Image
          src={profileIcon}
          alt="profileIcon"
          width={96}
          height={96}
          className="rounded-2xl"
        />
        <div className="flex flex-col gap-1">  
          <h5 className="lg:text-xl text-lg font-bold">{currentWallet?.name}</h5>
          <div className="flex text-sm cursor-pointer" onClick={handleCopyAddress}>
            <span>{shortenAddress(currentWallet?.address)}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2"><path d="M13.3346 10.7498V14.2498C13.3346 17.1665 12.168 18.3332 9.2513 18.3332H5.7513C2.83464 18.3332 1.66797 17.1665 1.66797 14.2498V10.7498C1.66797 7.83317 2.83464 6.6665 5.7513 6.6665H9.2513C12.168 6.6665 13.3346 7.83317 13.3346 10.7498Z" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.3346 5.74984V9.24984C18.3346 12.1665 17.168 13.3332 14.2513 13.3332H13.3346V10.7498C13.3346 7.83317 12.168 6.6665 9.2513 6.6665H6.66797V5.74984C6.66797 2.83317 7.83464 1.6665 10.7513 1.6665H14.2513C17.168 1.6665 18.3346 2.83317 18.3346 5.74984Z" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </div>
          <div>
            {Number(balance)} ETH
          </div>
        </div>
      </div>
      <button
        className="bg-black/50 p-2 rounded-xl backdrop-blur-lg h-10"
        onClick={handleLogout}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
      </button>
    </div>
  )
}