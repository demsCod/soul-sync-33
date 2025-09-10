import { Outlet } from "react-router-dom"
import { Header } from "./Header"

interface DashboardLayoutProps {
  onLogout: () => void
}

export function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-warm">
      <Header onLogout={onLogout} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}