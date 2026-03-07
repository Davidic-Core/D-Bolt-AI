import React from 'react'
import { useChatStore } from '../store/chatStore'
import { FiPlus, FiMessageSquare, FiTrash2, FiSettings, FiZap } from 'react-icons/fi'

export default function Sidebar() {
  const {
    sessions,
    activeSessionId,
    createSession,
    deleteSession,
    setActiveSession,
    setSettingsOpen,
  } = useChatStore()

  const handleNewChat = () => {
    createSession()
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    deleteSession(id)
  }

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FiZap className="logo-icon" />
          <span className="logo-text">D-Bolt-AI</span>
        </div>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <FiPlus />
          <span>New Chat</span>
        </button>
      </div>

      <div className="sidebar-sessions">
        {sessions.length === 0 ? (
          <div className="sessions-empty">
            <p>No conversations yet</p>
            <p>Start a new chat to begin</p>
          </div>
        ) : (
          <div className="sessions-list">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                onClick={() => setActiveSession(session.id)}
              >
                <FiMessageSquare className="session-icon" />
                <div className="session-info">
                  <span className="session-title">{session.title}</span>
                  <span className="session-date">{formatDate(session.updatedAt)}</span>
                </div>
                <button
                  className="session-delete"
                  onClick={(e) => handleDelete(e, session.id)}
                  title="Delete conversation"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <button className="settings-btn" onClick={() => setSettingsOpen(true)}>
          <FiSettings />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
