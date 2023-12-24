import { useState } from "react"
import { DashboardLayout } from "./Layout"

export const Dashboard = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [showSend, setShowSend] = useState<boolean>(true)
  const [showAlturaGuard, setShowAlturaGuard] = useState<boolean>(false)

  const handleMenu = (menuSelected: string) => {

    switch (menuSelected) {
      case "settings":
        setShowSettings(true)        
        setShowSend(false)
        setShowAlturaGuard(false)
        break;
      
      case "send":
        setShowSettings(false)
        setShowSend(true)
        setShowAlturaGuard(false)
        break;
      
      case "altura-guard":
        setShowSettings(false)
        setShowSend(false)
        setShowAlturaGuard(true)
          break;
    
      default:
        break;
    }

  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <button
            className="h-auto py-2 bg-slate-200 rounded-3xl p-3"
            onClick={() => handleMenu("altura-guard")}
            type="button"
            title=""
          >
            <span className="text-black"> Altura Guard </span>
          </button>
          <button
            className="flex h-9 justify-center w-9 rounded-full border border-gray-400 items-center"
            onClick={() => handleMenu("send")}
            type="button"
            title=""
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="#FFF" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
          </button>
          <button
            className="flex h-9 justify-center w-9 rounded-full border border-gray-400 items-center"
            onClick={() => handleMenu("settings")}
            type="button"
            title=""
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="white" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1.33398 8.58654V7.41321C1.33398 6.71988 1.90065 6.14654 2.60065 6.14654C3.80732 6.14654 4.30065 5.29321 3.69398 4.24654C3.34732 3.64654 3.55398 2.86654 4.16065 2.51988L5.31398 1.85988C5.84065 1.54654 6.52065 1.73321 6.83398 2.25988L6.90732 2.38654C7.50732 3.43321 8.49398 3.43321 9.10065 2.38654L9.17398 2.25988C9.48732 1.73321 10.1673 1.54654 10.694 1.85988L11.8473 2.51988C12.454 2.86654 12.6607 3.64654 12.314 4.24654C11.7073 5.29321 12.2007 6.14654 13.4073 6.14654C14.1007 6.14654 14.674 6.71321 14.674 7.41321V8.58654C14.674 9.27988 14.1073 9.85321 13.4073 9.85321C12.2007 9.85321 11.7073 10.7065 12.314 11.7532C12.6607 12.3599 12.454 13.1332 11.8473 13.4799L10.694 14.1399C10.1673 14.4532 9.48732 14.2665 9.17398 13.7399L9.10065 13.6132C8.50065 12.5665 7.51398 12.5665 6.90732 13.6132L6.83398 13.7399C6.52065 14.2665 5.84065 14.4532 5.31398 14.1399L4.16065 13.4799C3.55398 13.1332 3.34732 12.3532 3.69398 11.7532C4.30065 10.7065 3.80732 9.85321 2.60065 9.85321C1.90065 9.85321 1.33398 9.27988 1.33398 8.58654Z" stroke="white" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </button>
        </div>

        {showAlturaGuard && (
          <>
            <h5 className="text-2xl font-semibold">Altura Guard</h5>
          </>
        )}
        
        {showSend && (
          <>
            <h5 className="text-2xl font-semibold">Send ETH</h5>
            <input
              key="to_address"
              className="w-2/5 p-2 rounded-lg text-black"
              type="text" 
              placeholder="Address"
              // onChange={(e) => setWalletName(e.target.value)}
            />
            <input
              key="to_address"
              className="w-2/5 p-2 rounded-lg text-black"
              type="number"
              placeholder="Amount"
              // onChange={(e) => setWalletName(e.target.value)}
            />
            <button
              key="send_submit"
              type="submit"
              className="w-2/5 p-2 rounded-lg bg-purple-900 hover:bg-purple-950"
            >
              Send
            </button>
          </>
        )}
        
        {showSettings && (
          <>
            <h5 className="text-2xl font-semibold">Settings</h5>
          </>
        )}

      </div>
    </DashboardLayout>
  )
}