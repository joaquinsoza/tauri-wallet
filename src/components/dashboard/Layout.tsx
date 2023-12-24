import { Header } from "./Header"
import { StatusBar } from "./StatusBar"

export const DashboardLayout = ({children} : {children: React.ReactNode}) => {

  return (
    <div>
      <Header />
        <div className="p-4"> 
          {children}
        </div>
      <StatusBar />
    </div>
  )
}