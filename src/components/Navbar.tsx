import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiZap, FiSettings } from 'react-icons/fi'
import { useChatStore } from '../store/chatStore'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSettingsOpen } = useChatStore()

  const isActive = (path: string) => location.pathname === path

  const handleSettingsClick = () => {
    if (location.pathname === '/chat') {
      // If on chat page, just toggle the modal
      setSettingsOpen(true)
    } else {
      // If on other pages, navigate to chat with settings
      navigate('/chat')
      setTimeout(() => setSettingsOpen(true), 100)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-logo" onClick={() => navigate('/')}>
          <FiZap size={20} />
          <span>D⚡BOLT</span>
        </button>
      </div>

      <div className="navbar-center">
        <a
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          Home
        </a>
        <a
          className={`nav-link ${isActive('/chat') ? 'active' : ''}`}
          onClick={() => navigate('/chat')}
        >
          Chat
        </a>
      </div>

      <div className="navbar-right">
        <button
          className="nav-icon-btn"
          onClick={handleSettingsClick}
          title="Settings"
          aria-label="Open settings"
        >
          <FiSettings size={20} />
        </button>
      </div>
    </nav>
  )
}
