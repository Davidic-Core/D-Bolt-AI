import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '../types'
import { FiUser, FiCopy, FiCheck, FiRotateCw } from 'react-icons/fi'
import { FiZap } from 'react-icons/fi'

interface Props {
  message: Message
  onCopyMessage?: () => void
  onRegenerateMessage?: () => void
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-lang">{language || 'code'}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          background: '#0d0d0d',
          fontSize: '13px',
          padding: '16px',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

export default function ChatMessage({ message, onCopyMessage, onRegenerateMessage }: Props) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = React.useState(false)

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopyMessage?.()
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="avatar avatar-user">
            <FiUser size={16} />
          </div>
        ) : (
          <div className="avatar avatar-ai">
            <FiZap size={16} />
          </div>
        )}
      </div>
      <div className="message-content">
        {isUser ? (
          <p className="message-text">{message.content}</p>
        ) : (
          <div className="message-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const value = String(children).replace(/\n$/, '')
                  return !inline && match ? (
                    <CodeBlock language={match[1]} value={value} />
                  ) : (
                    <code className="inline-code" {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && <span className="cursor-blink">▋</span>}
          </div>
        )}
      </div>
      <div className="message-actions">
        <button
          className="message-action-btn"
          onClick={handleCopyMessage}
          title="Copy message"
          aria-label="Copy message"
        >
          {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
        </button>
        {!isUser && onRegenerateMessage && (
          <button
            className="message-action-btn"
            onClick={onRegenerateMessage}
            title="Regenerate response"
            aria-label="Regenerate response"
          >
            <FiRotateCw size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
