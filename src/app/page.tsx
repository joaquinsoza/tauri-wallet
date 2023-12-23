'use client'

import Image from 'next/image'
import { useState } from 'react';
import alturaLogo from '@/assets/alturaicon.webp'
import { ButtonPrimary } from '@/components/buttons/ButtonPrimary';
import { CreateWalletFlow } from '@/components/modals/CreateWalletFlow/CreateWalletFlow';
import MainWalletSelector from '@/components/MainWalletSelector';
import { openExternalLink } from '@/utils/tauri';
import { useCurrentWallet } from '@/contexts/CurrentWalletContext';
import { Dashboard } from '@/components/dashboard/Dashoboard';

export default function Home() {
  const {currentWallet} = useCurrentWallet()
  const [showCreateWalletFlow, setShowCreateWalletFlow] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  const handleCreateWalletClick = () => {
    setShowCreateWalletFlow(!showCreateWalletFlow);
  };

  const handleImportWalletClick = () => {
    setShowImportForm(!showImportForm);
  };

  if (currentWallet) return (
    <Dashboard />
  )

  return (
    <main className='bg-gradient-to-br from-gray-900 to-blue-800 min-h-screen p-6 flex flex-col justify-between'>
      <div className='text-center text-white mb-8'>
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
        
      <MainWalletSelector />

      {showCreateWalletFlow && (
        <CreateWalletFlow onCancel={() => setShowCreateWalletFlow(false)}/>
      )}

      {showImportForm && (
        <>Import form</>
        // <ImportWalletForm onCancel={() => setShowImportForm(false)} />
      )}
      
      <div>
        <div className='flex justify-center'>
          <button
            className='bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg mx-2 transition-colors'
            onClick={handleCreateWalletClick}
          >
            Create Wallet
          </button>
          <button
            className='bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg mx-2 transition-colors'
            onClick={handleImportWalletClick}
          >
            Import Wallet
          </button>
        </div>
        <p
          className='font-mono font-bold cursor-pointer text-center text-xs mt-4'
          onClick={() => openExternalLink('https://joaquinsoza.dev')}
        >
          By coderipper
        </p>
      </div>
    </main>
  )
}