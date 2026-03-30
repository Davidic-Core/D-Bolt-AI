import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '../types'
import { FiUser, FiCopy, FiCheck, FiRotateCw, FiEdit2, FiSave, FiX, FiZap } from 'react-icons/fi'

const RESPONSE_SUGGESTIONS = [
  'Explain this in more detail',
  'Add error handling',
  'Optimize this code',
  'Add comments',
  'Convert to TypeScript',
  'Show me an example',
]

function detectLanguage(code: string): string {
  const s = code.trimStart()
  if (/^<[a-zA-Z]/.test(s) || /<\/[a-zA-Z]+>/.test(s)) return 'html'
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s/i.test(s)) return 'sql'
  if (/^(import|from)\s+\w/.test(s) && /def\s+\w+\(|:\s*$/.test(s)) return 'python'
  if (/^(import|export|const|let|var|function|class|interface|type|async)\b/.test(s)) return 'typescript'
  if (/^(package|import)\s+\w/.test(s) && /func\s+\w+\(|:=/.test(s)) return 'go'
  if (/^(use|fn|let\s+mut|impl|struct|enum)\b/.test(s)) return 'rust'
  if (/^(#include|int\s+main|void\s+\w+\(|std::)/.test(s)) return 'cpp'
  if (/^(public\s+class|import\s+java\.|@Override)/.test(s)) return 'java'
  if (/^\s*[\$#]\s/.test(s) || /^(echo|export|source|chmod|grep|awk|sed)\b/.test(s)) return 'bash'
  if (/^\s*\{[\s\S]*"[\w-]+":\s/.test(s) || /^\[[\s\S]*\]$/.test(s)) return 'json'
  if (/^(---|\w[\w-]*:)/.test(s)) return 'yaml'
  if (/^(import|from)\s+\w/.test(s)) return 'javascript'
  return 'text'
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

interface Props {
  message: Message
  isLast?: boolean
  onCopyMessage?: () => void
  onRegenerateMessage?: () => void
  onEditMessage?: (newContent: string) => void
  onSuggestion?: (prompt: string) => void
}

function ChatMessage({ message, isLast, onCopyMessage, onRegenerateMessage, onEditMessage, onSuggestion }: Props) {
  const isUser = message.role === 'user'
  const [copied, setCopied] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editContent, setEditContent] = React.useState(message.content)

  React.useEffect(() => {
    if (!isEditing) setEditContent(message.content)
  }, [message.content, isEditing])

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopyMessage?.()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEditMessage?.(editContent)
      setIsEditing(false)
    }
  }

  const handleCancelEdit = () => {
    setEditContent(message.content)
    setIsEditing(false)
  }

  const showSuggestions = isLast && !isUser && !message.isStreaming && message.content.length > 0 && !!onSuggestion

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
          isEditing ? (
            <div className="edit-mode">
              <textarea
                className="edit-textarea"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                autoFocus
              />
              <div className="edit-actions">
                <button className="edit-btn save" onClick={handleSaveEdit}>
                  <FiSave size={14} /> Save
                </button>
                <button className="edit-btn cancel" onClick={handleCancelEdit}>
                  <FiX size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="message-text">{message.content}</p>
          )
        ) : (
          <div className="message-markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { className, children } = props
                  const isInline = !className && !String(children).includes('\n')
                  const match = /language-(\w+)/.exec(className || '')
                  const value = String(children).replace(/\n$/, '')

                  if (!isInline) {
                    const lang = match ? match[1] : detectLanguage(value)
                    return <CodeBlock language={lang} value={value} />
                  }
                  return <code className="inline-code">{children}</code>
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && <span className="cursor-blink" aria-hidden="true">▋</span>}
          </div>
        )}

        {showSuggestions && (
          <div className="response-suggestions" aria-label="Quick follow-up actions">
            {RESPONSE_SUGGESTIONS.slice(0, 4).map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onClick={() => onSuggestion!(s)}
                title={s}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="message-actions">
          <button
            className="message-action-btn"
            onClick={handleCopyMessage}
            title="Copy message"
            aria-label="Copy message"
          >
            {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
          </button>
          {isUser && onEditMessage && (
            <button
              className="message-action-btn"
              onClick={() => setIsEditing(true)}
              title="Edit message"
              aria-label="Edit message"
            >
              <FiEdit2 size={16} />
            </button>
          )}
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
      )}
    </div>
  )
}

function messagePropsAreEqual(prev: Props, next: Props): boolean {
  return (
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.message.isStreaming === next.message.isStreaming &&
    prev.isLast === next.isLast
  )
}

export default React.memo(ChatMessage, messagePropsAreEqual)
