import { useState } from "react"
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage"
import { DiscoverPage } from "./pages/DiscoverPage"
import { ProfilePage } from "./pages/ProfilePage"
import { SearchPage } from "./pages/SearchPage"
import { ProfileViewPage } from "./pages/ProfileViewPage"
import { ChatPage } from "./pages/ChatPage"
import { NotificationsPage } from "./pages/NotificationsPage"
import { DashboardLayout } from "./components/layout/DashboardLayout"
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleAuth = (type: 'login' | 'register') => {
    console.log(`${type} attempted`)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/auth" 
              element={
                isAuthenticated ? (
                  <Navigate to="/discover" replace />
                ) : (
                  <LandingPage onAuth={handleAuth} />
                )
              } 
            />
            
            {/* Protected routes with layout */}
            <Route path="/" element={
              isAuthenticated ? (
                <DashboardLayout onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }>
              <Route index element={<Navigate to="/discover" replace />} />
              <Route path="discover" element={<DiscoverPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="profile/:userId" element={<ProfileViewPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="chat/:matchId" element={<ChatPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App;