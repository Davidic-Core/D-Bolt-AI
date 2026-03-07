import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { streamCompletion, generateTitle } from '../utils/ai'
import { Message } from '../types'
import { FiZap } from 'react-icons/fi'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export default function ChatArea() {
  const {
    getActiveSession,
    activeSessionId,
    settings,
    addMessage,
    updateMessage,
    updateSessionTitle,
    createSession,
  } = useChatStore()

  const [isStreaming, setIsStreaming] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const session = getActiveSession()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  const handleSend = async (content: string) => {
    let sessionId = activeSessionId
    if (!sessionId) {
      sessionId = createSession()
    }

    setError(null)
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    addMessage(sessionId, userMessage)

    const currentSession = useChatStore.getState().sessions.find(s => s.id === sessionId)
    if (currentSession?.messages.length === 0 || currentSession?.title === 'New Chat') {
      updateSessionTitle(sessionId, generateTitle(content))
    }

    const assistantId = generateId()
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(sessionId, assistantMessage)

    const allMessages = [
      ...(currentSession?.messages ?? []),
      userMessage,
    ]

    abortRef.current = new AbortController()
    setIsStreaming(true)

    let fullContent = ''

    try {
      for await (const chunk of streamCompletion(allMessages, settings, abortRef.current.signal)) {
        fullContent += chunk
        updateMessage(sessionId, assistantId, fullContent, true)
      }
      updateMessage(sessionId, assistantId, fullContent, false)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        updateMessage(sessionId, assistantId, fullContent || '*(stopped)*', false)
      } else {
        const msg = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(msg)
        updateMessage(sessionId, assistantId, `*(Error: ${msg})*`, false)
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  if (!session) {
    return (
      <div className="chat-empty">
        <div className="welcome-screen">
          <div className="welcome-logo">
            <FiZap size={48} />
          </div>
          <h1>Welcome to D-Bolt-AI</h1>
          <p>Your intelligent coding assistant powered by leading AI models.</p>
          <div className="welcome-features">
            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Instant Code Help</h3>
              <p>Get code suggestions, explanations, and fixes in seconds</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>Multiple AI Models</h3>
              <p>Choose from GPT-4, Claude, Gemini, Llama and more</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Your API Key</h3>
              <p>Use your own OpenRouter key — full privacy and control</p>
            </div>
          </div>
          <p className="welcome-cta">Click <strong>New Chat</strong> to start coding with AI</p>
        </div>
        <ChatInput onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} />
      </div>
    )
  }

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {session.messages.length === 0 ? (
          <div className="chat-start-hint">
            <FiZap size={24} />
            <p>Start the conversation</p>
          </div>
        ) : (
          session.messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} />
    </div>
  )
}
