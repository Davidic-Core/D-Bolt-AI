import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/chatStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import SuggestedPrompts from './SuggestedPrompts'
import TypingIndicator from './TypingIndicator'
import { streamCompletion, generateTitle } from '../utils/ai'
import { Message } from '../types'
import { FiZap, FiDownload, FiRefreshCw } from 'react-icons/fi'

function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

interface StreamRequest {
  sessionId: string
  allMessages: Message[]
  assistantId: string
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
  const lastRequestRef = useRef<StreamRequest | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const session = getActiveSession()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session?.messages])

  const runStream = async ({ sessionId, allMessages, assistantId }: StreamRequest) => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setIsStreaming(true)
    setError(null)

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
        const msg = err instanceof Error ? err.message : 'Unknown error occurred.'
        setError(msg)
        updateMessage(sessionId, assistantId, `*(Error: ${msg})*`, false)
      }
    } finally {
      setIsStreaming(false)
      abortRef.current = null
    }
  }

  const handleSend = async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed || isStreaming) return

    let sessionId = activeSessionId
    if (!sessionId) {
      sessionId = createSession()
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    addMessage(sessionId, userMessage)

    const currentSession = useChatStore.getState().sessions.find(s => s.id === sessionId)
    if (currentSession?.messages.length === 0 || currentSession?.title === 'New Chat') {
      updateSessionTitle(sessionId!, generateTitle(trimmed))
    }

    const assistantId = generateId()
    const assistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(sessionId!, assistantMessage)

    const allMessages = [
      ...(currentSession?.messages ?? []),
      userMessage,
    ]

    const req: StreamRequest = { sessionId: sessionId!, allMessages, assistantId }
    lastRequestRef.current = req
    await runStream(req)
  }

  const handleStop = () => {
    abortRef.current?.abort()
  }

  const handleRetry = async () => {
    if (!lastRequestRef.current || isStreaming) return

    const { sessionId, allMessages } = lastRequestRef.current

    const assistantId = generateId()
    const retryMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(sessionId, retryMessage)

    const req: StreamRequest = { sessionId, allMessages, assistantId }
    lastRequestRef.current = req
    await runStream(req)
  }

  const handleRegenerateMessage = async (messageId: string) => {
    if (!session || activeSessionId === null || isStreaming) return

    const messageIdx = session.messages.findIndex(m => m.id === messageId)
    if (messageIdx < 0) return

    const userMessageIdx = messageIdx - 1
    if (userMessageIdx < 0 || session.messages[userMessageIdx].role !== 'user') return

    const assistantId = generateId()
    const newAssistantMessage: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }
    addMessage(activeSessionId, newAssistantMessage)

    const allMessages = session.messages.slice(0, userMessageIdx + 1)
    const req: StreamRequest = { sessionId: activeSessionId, allMessages, assistantId }
    lastRequestRef.current = req
    await runStream(req)
  }

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!session || activeSessionId === null) return
    updateMessage(activeSessionId, messageId, newContent, false)
  }

  const handleExportChat = (format: 'json' | 'txt') => {
    if (!session) return

    let content: string
    if (format === 'json') {
      content = JSON.stringify(
        {
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          model: session.model,
          messages: session.messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
        },
        null,
        2
      )
    } else {
      content = `# ${session.title}\n\nCreated: ${session.createdAt.toLocaleString()}\nModel: ${session.model}\n\n---\n\n`
      content += session.messages
        .map(m => `**${m.role.toUpperCase()}:**\n${m.content}`)
        .join('\n\n---\n\n')
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${Date.now()}.${format === 'json' ? 'json' : 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!session) {
    return (
      <div className="chat-area">
        <div className="chat-empty-state">
          <div className="chat-empty-content">
            <FiZap size={40} className="empty-icon" />
            <h2>Welcome to D-Bolt-AI</h2>
            <p>Your intelligent coding assistant is ready to help</p>
            <SuggestedPrompts onSelectPrompt={handleSend} />
          </div>
        </div>
        <ChatInput onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} />
      </div>
    )
  }

  return (
    <div className="chat-area">
      <div className="chat-toolbar">
        <button
          className="export-btn"
          onClick={() => handleExportChat('json')}
          title="Export as JSON"
          aria-label="Export chat as JSON"
        >
          <FiDownload size={16} /> JSON
        </button>
        <button
          className="export-btn"
          onClick={() => handleExportChat('txt')}
          title="Export as Text"
          aria-label="Export chat as text"
        >
          <FiDownload size={16} /> TXT
        </button>
      </div>
      <div className="chat-messages">
        {session.messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-content">
              <FiZap size={40} className="empty-icon" />
              <h2>Welcome to D-Bolt-AI</h2>
              <p>Your intelligent coding assistant is ready to help</p>
              <SuggestedPrompts onSelectPrompt={handleSend} />
            </div>
          </div>
        ) : (
          <div className="chat-messages-list">
            {session.messages.map(message => (
              <ChatMessage
                key={message.id}
                message={message}
                onRegenerateMessage={
                  message.role === 'assistant' ? () => handleRegenerateMessage(message.id) : undefined
                }
                onEditMessage={
                  message.role === 'user' ? (newContent) => handleEditMessage(message.id, newContent) : undefined
                }
              />
            ))}
            {isStreaming && <TypingIndicator />}
          </div>
        )}
        {error && (
          <div className="error-banner">
            <span><strong>Error:</strong> {error}</span>
            <button
              className="retry-btn"
              onClick={handleRetry}
              disabled={isStreaming}
              title="Retry last request"
            >
              <FiRefreshCw size={13} />
              Retry
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <ChatInput onSend={handleSend} onStop={handleStop} isStreaming={isStreaming} />
    </div>
  )
}
