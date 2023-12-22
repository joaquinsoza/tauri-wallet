'use client'

import Image from 'next/image'
import Greet from '../components/greet'
import { useState } from 'react';
import alturaLogo from '@/assets/alturaicon.webp'
import { ButtonPrimary } from '@/components/buttons/ButtonPrimary';
import { CreateWalletFlow } from '@/components/modals/CreateWalletFlow/CreateWalletFlow';

export default function Home() {
  const [showCreateWalletFlow, setShowCreateWalletFlow] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  const handleCreateWalletClick = () => {
    setShowCreateWalletFlow(!showCreateWalletFlow);
  };

  const handleImportWalletClick = () => {
    setShowImportForm(!showImportForm);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 items-center gap-4">
          <Image
            alt='alturanft'
            src={alturaLogo}
            width={50}
            height={50}
          />
          Welcome Altura Wallet
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By <span className="font-mono font-bold cursor-pointer">coderipper</span>
          </a>
        </div>
        <div className='flex justify-center items-center gap-10'>
          <ButtonPrimary onClick={handleCreateWalletClick}>Create Wallet</ButtonPrimary>
          <ButtonPrimary onClick={handleImportWalletClick}>Import Wallet</ButtonPrimary>
        </div>
        {showCreateWalletFlow && (
          <CreateWalletFlow onCancel={() => setShowCreateWalletFlow(false)}/>
        )}

        {showImportForm && (
          <Greet />
          // <ImportWalletForm onCancel={() => setShowImportForm(false)} />
        )}
      </div>
    </main>
  )
}
