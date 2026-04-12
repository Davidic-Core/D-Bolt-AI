import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCode, FiSave, FiGrid, FiZap, FiUpload, FiX, FiImage, FiCopy, FiCheck } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import BoltIcon from '../components/BoltIcon'
import { useChatStore } from '../store/chatStore'
import { analyzeImageStream } from '../utils/ai'
import './HomePage.css'

function ImageAnalysisSection() {
  const { settings } = useChatStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, GIF, WebP).')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB.')
      return
    }
    setError(null)
    setResult('')
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreviewUrl(dataUrl)
      setImageDataUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) loadFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
    e.target.value = ''
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreviewUrl(null)
    setImageDataUrl(null)
    setResult('')
    setError(null)
    abortRef.current?.abort()
    setIsAnalyzing(false)
  }

  const handleAnalyze = async () => {
    if (!imageDataUrl) return
    setError(null)
    setResult('')
    setIsAnalyzing(true)
    abortRef.current = new AbortController()

    try {
      for await (const chunk of analyzeImageStream(
        imageDataUrl,
        settings.apiKey,
        abortRef.current.signal
      )) {
        setResult(prev => prev + chunk)
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      const msg = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(msg)
    } finally {
      setIsAnalyzing(false)
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
    setIsAnalyzing(false)
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <section className="image-analysis">
      <div className="image-analysis-inner">
        <div className="image-analysis-header">
          <div className="image-analysis-icon">
            <FiImage size={28} />
          </div>
          <h2>Image Analysis</h2>
          <p className="image-analysis-subtitle">
            Upload a screenshot, diagram, UI mockup, or any image — D⚡BOLT will analyze it instantly.
          </p>
        </div>

        <div
          className={`drop-zone${isDragOver ? ' drag-over' : ''}${previewUrl ? ' has-image' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !previewUrl && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload image for analysis"
          onKeyDown={(e) => e.key === 'Enter' && !previewUrl && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input-hidden"
            aria-hidden="true"
          />

          {previewUrl ? (
            <div className="image-preview-container">
              <img src={previewUrl} alt="Uploaded for analysis" className="image-preview" />
              <button
                className="remove-image-btn"
                onClick={handleRemove}
                aria-label="Remove image"
                title="Remove image"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div className="drop-zone-placeholder">
              <div className="drop-zone-icon">
                <FiUpload size={36} />
              </div>
              <p className="drop-zone-text">Drag &amp; drop an image here</p>
              <span className="drop-zone-sub">or click to browse</span>
              <span className="drop-zone-formats">PNG · JPG · GIF · WebP &nbsp;·&nbsp; up to 10 MB</span>
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="analyze-actions">
            {isAnalyzing ? (
              <button className="analyze-btn analyzing" onClick={handleStop} aria-label="Stop analysis">
                <span className="btn-spinner" aria-hidden="true" />
                Stop Analysis
              </button>
            ) : (
              <button className="analyze-btn" onClick={handleAnalyze} aria-label="Analyze image">
                <FiZap size={18} />
                Analyze Image
              </button>
            )}
          </div>
        )}

        {error && (
          <div className="analysis-error" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {(result || isAnalyzing) && (
          <div className="analysis-result" ref={resultRef}>
            <div className="analysis-result-header">
              <FiZap size={15} />
              <span>AI Analysis</span>
              <button
                className={`result-copy-btn${isCopied ? ' copied' : ''}`}
                onClick={handleCopy}
                disabled={!result || isAnalyzing}
                aria-label={isCopied ? 'Copied!' : 'Copy analysis to clipboard'}
                title={isCopied ? 'Copied!' : 'Copy to clipboard'}
              >
                {isCopied ? <FiCheck size={14} /> : <FiCopy size={14} />}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="analysis-result-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
              {isAnalyzing && <span className="cursor-blink" aria-hidden="true">▋</span>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'D⚡BOLT — AI-powered Development Companion'
  }, [])

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-glow" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-bolt">
            <BoltIcon size={200} />
          </div>
          <h1 className="hero-title">D⚡BOLT</h1>
          <p className="hero-welcome">Welcome to D-Bolt ⚡</p>
          <p className="hero-description">
            Your AI-powered development companion.<br />
            Build faster. Think smarter. Ship instantly.
          </p>
          <div className="hero-cta-group">
            <button className="hero-cta hero-cta--filled" onClick={() => navigate('/chat')}>
              Start Building
            </button>
            <button className="hero-cta hero-cta--outline" onClick={() => navigate('/chat')}>
              Open Chat
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose D⚡BOLT?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FiCode size={32} /></div>
            <h3>Coding Assistance</h3>
            <p>Get instant code suggestions, refactoring help, and expert explanations for any programming challenge.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiZap size={32} /></div>
            <h3>Real-Time Streaming</h3>
            <p>Watch responses appear word-by-word with ultra-fast streaming technology for an engaging experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiSave size={32} /></div>
            <h3>Persistent Conversations</h3>
            <p>All your chats are automatically saved. Pick up right where you left off, anytime.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FiGrid size={32} /></div>
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

      {/* Image Analysis Section */}
      <ImageAnalysisSection />

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Code Smarter?</h2>
        <p>Start your first conversation with D⚡BOLT today.</p>
        <button className="cta-button" onClick={() => navigate('/chat')}>
          Launch Chat
        </button>
      </section>
    </div>
  )
}
