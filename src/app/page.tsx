'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import alturaLogo from '@/assets/alturaicon.webp'
import { ButtonPrimary } from '@/components/buttons/ButtonPrimary';
import { CreateWalletFlow } from '@/components/modals/CreateWalletFlow/CreateWalletFlow';
import MainWalletSelector from '@/components/MainWalletSelector';
import { openExternalLink } from '@/utils/tauri';
import { useCurrentWallet } from '@/contexts/CurrentWalletContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PublicWalletInfo } from '@/interfaces/wallet';
import { invoke } from '@tauri-apps/api/tauri';
import { ImportWalletFlow } from '@/components/modals/ImportWalletFlow/ImportWalletFlow';
import { EthereumProvider } from '@/contexts/EthereumContext';

export default function Home() {
  const {currentWallet} = useCurrentWallet()
  const [showCreateWalletFlow, setShowCreateWalletFlow] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [wallets, setWallets] = useState<PublicWalletInfo[]>();


  useEffect(() => {
    invoke<string>('all_wallets')
      .then((result: string) => {
        const resultJson = JSON.parse(result)
        setWallets(resultJson)
      })
      .catch(console.error)
  }, [currentWallet])

  const handleCreateWalletClick = () => {
    setShowCreateWalletFlow(!showCreateWalletFlow);
  };

  const handleImportWalletClick = () => {
    setShowImportForm(!showImportForm);
  };

  if (currentWallet) return (
    <EthereumProvider>
      <Dashboard />
    </EthereumProvider>
  )

  return (
    <main className='bg-gradient-to-b from-[#0D1B27] to-[#1B0D2B] min-h-screen p-6 flex flex-col justify-between'>
      <div className='text-center text-white mb-8 select-none'>
        <div className='flex justify-center items-center gap-4'>
          <Image
            alt='alturanft'
            src={alturaLogo}
            width={50}
            height={50}
          />
          <h1 className='text-4xl font-bold mb-2'>Altura Wallet</h1>
        </div>
        <p className='font-light text-lg'>Select your wallet</p>
      </div>

      {wallets && wallets?.length > 0 && (
        <MainWalletSelector wallets={wallets} />
      )}

      {showCreateWalletFlow && (
        <CreateWalletFlow onCancel={() => setShowCreateWalletFlow(false)}/>
      )}

      {showImportForm && (
        <ImportWalletFlow onCancel={() => setShowImportForm(false)} />
      )}

      <div className='h-full'>
        <div className='flex justify-center'>
          <button
            className='bg-[#00BFFF] hover:bg-[#00BFFF]/80 text-white py-2 px-4 rounded-lg mx-2 transition-colors'
            onClick={handleCreateWalletClick}
          >
            Create new Wallet
          </button>
          <button
            className='hover:bg-[#00BFFF] text-white py-2 px-4 rounded-lg mx-2 transition-colors border border-[#00BFFF]'
            onClick={handleImportWalletClick}
          >
            Import Wallet
          </button>
        </div>
      </div>
      
      <p
        className='font-mono font-bold cursor-pointer text-center text-xs mt-4 select-none'
        onClick={() => openExternalLink('https://joaquinsoza.dev')}
      >
        By coderipper
      </p>
    </main>
  )
}