import React, { useRef, useEffect } from 'react'
import { FiSend, FiSquare } from 'react-icons/fi'

interface Props {
  onSend: (message: string) => void
  onStop?: () => void
  isStreaming: boolean
  disabled?: boolean
}

export default function ChatInput({ onSend, onStop, isStreaming, disabled }: Props) {
  const [value, setValue] = React.useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask D-Bolt-AI anything... (Shift+Enter for new line)"
          rows={1}
          disabled={disabled}
        />
        <div className="chat-input-actions">
          {isStreaming ? (
            <button
              className="send-btn stop-btn"
              onClick={onStop}
              title="Stop generation"
            >
              <FiSquare size={18} />
            </button>
          ) : (
            <button
              className="send-btn"
              onClick={handleSubmit}
              disabled={!value.trim() || disabled}
              title="Send message (Enter)"
            >
              <FiSend size={18} />
            </button>
          )}
        </div>
      </div>
      <p className="chat-input-hint">
        D-Bolt-AI can make mistakes. Verify important information.
      </p>
    </div>
  )
}
