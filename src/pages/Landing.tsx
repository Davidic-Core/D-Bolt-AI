import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiZap, FiCode, FiSave, FiGrid } from 'react-icons/fi'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'D-Bolt-AI — AI Chat Assistant'
  }, [])

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-icon">
            <FiZap size={48} />
          </div>
          <h1 className="hero-title">D-Bolt AI</h1>
          <p className="hero-subtitle">Your Intelligent Coding Assistant</p>
          <p className="hero-description">
            Experience the power of advanced AI models for instant code analysis, suggestions, and intelligent conversation.
          </p>
          <button className="hero-cta" onClick={() => navigate('/chat')}>
            Start Chat
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose D-Bolt AI?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FiCode size={32} />
            </div>
            <h3>Coding Assistance</h3>
            <p>Get instant code suggestions, refactoring help, and expert explanations for any programming challenge.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiZap size={32} />
            </div>
            <h3>Real-Time Streaming</h3>
            <p>Watch responses appear word-by-word with ultra-fast streaming technology for an engaging experience.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiSave size={32} />
            </div>
            <h3>Persistent Conversations</h3>
            <p>All your chats are automatically saved. Pick up right where you left off, anytime.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FiGrid size={32} />
            </div>
            <h3>Multi-Model Support</h3>
            <p>Choose from GPT-4o, Claude 3.5 Sonnet, and more. Pick the best model for your task.</p>
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="models">
        <h2>Supported AI Models</h2>
        <div className="models-grid">
          <div className="model-item">
            <h4>OpenAI</h4>
            <ul>
              <li>GPT-4o</li>
              <li>GPT-4o Mini</li>
            </ul>
          </div>
          <div className="model-item">
            <h4>Anthropic</h4>
            <ul>
              <li>Claude 3.5 Sonnet</li>
              <li>Claude 3 Haiku</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Code Smarter?</h2>
        <p>Start your first conversation with D-Bolt AI today.</p>
        <button className="cta-button" onClick={() => navigate('/chat')}>
          Launch Chat
        </button>
      </section>
    </div>
  )
}
