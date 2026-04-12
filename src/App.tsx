import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Settings from './components/Settings'
import ErrorBoundary from './components/ErrorBoundary'
import AppLayout from './layouts/AppLayout'
import { useChatStore } from './store/chatStore'
import './App.css'

const Landing = lazy(() => import('./pages/Landing'))

function ChatPage() {
  const { isSettingsOpen, isSidebarOpen, setSidebarOpen } = useChatStore()

  React.useEffect(() => {
    document.title = 'Chat • D⚡BOLT'
  }, [])

  return (
    <div className="app">
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <Sidebar />
      </div>
      <div className="main-container">
        <div className="topbar">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            title="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="topbar-title">D⚡BOLT</span>
        </div>
        <ChatArea />
      </div>
      {isSettingsOpen && <Settings />}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app-wrapper">
          <Navbar />
          <div className="app-content">
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
                    <AppLayout>
                      <Landing />
                    </AppLayout>
                  </Suspense>
                }
              />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
