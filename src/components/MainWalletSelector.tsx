'use client'

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import { chooseRandomIcon } from '@/utils/chooseRandomIcon';
import { LoginModal } from './modals/LoginModal/LoginModal';
import { PublicWalletInfo } from '@/interfaces/wallet';

export default function MainWalletSelector() {
  const [wallets, setWallets] = useState<PublicWalletInfo[]>();
  const [selectedWallet, setSelectedWallet] = useState<PublicWalletInfo | null>(null);

  useEffect(() => {
    invoke<string>('all_wallets')
      .then((result: string) => {
        const resultJson = JSON.parse(result)
        setWallets(resultJson)
      })
      .catch(console.error)
  }, [])

  if(!wallets) return

  return (
    <>
      <div className='flex flex-col items-center w-full h-full overflow-x-scroll'>
        <div className='grid grid-rows-2 grid-flow-col auto-cols-max gap-4 overflow-x-auto p-4'>
          {wallets.map((wallet, index) => (
            <div
              onClick={() => setSelectedWallet(wallet)}
              className='w-36 h-36 bg-cover rounded-3xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 flex items-end'
              key={index}
              style={{ backgroundImage: `url(${chooseRandomIcon()})` }}
            >
              <span className="text-white text-md text-center font-semibold bg-gray-800 bg-opacity-75 w-full py-1">
                {wallet.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {selectedWallet && (
        <LoginModal onCancel={() => setSelectedWallet(null)} selectedWallet={selectedWallet} />
      )}
    </>
  );
}
