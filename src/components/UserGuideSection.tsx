import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import guideContent from '../../GUIDE.md?raw'
import './UserGuideSection.css'

const TOC_ITEMS = [
  { id: 'introduction',    label: 'Introduction' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'image-analysis',  label: 'Image Analysis' },
  { id: 'chat-features',   label: 'Chat Features' },
  { id: 'data-management', label: 'Data Management' },
  { id: 'deployment',      label: 'Deployment' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
  h1: ({ children }) => {
    const id = slugify(String(children))
    return <h1 id={id} className="guide-h1">{children}</h1>
  },
  h2: ({ children }) => {
    const id = slugify(String(children))
    return <h2 id={id} className="guide-h2">{children}</h2>
  },
  h3: ({ children }) => {
    const id = slugify(String(children))
    return <h3 id={id} className="guide-h3">{children}</h3>
  },
  p: ({ children }) => <p className="guide-p">{children}</p>,
  ul: ({ children }) => <ul className="guide-ul">{children}</ul>,
  ol: ({ children }) => <ol className="guide-ol">{children}</ol>,
  li: ({ children }) => <li className="guide-li">{children}</li>,
  strong: ({ children }) => <strong className="guide-strong">{children}</strong>,
  blockquote: ({ children }) => <blockquote className="guide-blockquote">{children}</blockquote>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-')
    return isBlock
      ? <code className={`guide-code-block ${className ?? ''}`}>{children}</code>
      : <code className="guide-code-inline">{children}</code>
  },
  pre: ({ children }) => <pre className="guide-pre">{children}</pre>,
  table: ({ children }) => (
    <div className="guide-table-wrapper">
      <table className="guide-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="guide-thead">{children}</thead>,
  th: ({ children }) => <th className="guide-th">{children}</th>,
  td: ({ children }) => <td className="guide-td">{children}</td>,
  hr: () => <hr className="guide-hr" />,
  a: ({ children, href }) => (
    <a className="guide-a" href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

export default function UserGuideSection() {
  const [activeId, setActiveId] = useState('introduction')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headings = contentRef.current?.querySelectorAll('h2[id]')
    if (!headings?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  return (
    <section id="user-guide" className="guide-section">
      <div className="guide-section-header">
        <h2 className="guide-section-title">User Guide</h2>
        <p className="guide-section-subtitle">
          Everything you need to get up and running with D-Bolt.
        </p>
      </div>

      <div className="guide-layout">
        <aside className="guide-toc">
          <p className="guide-toc-label">On this page</p>
          <nav aria-label="Guide table of contents">
            {TOC_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`guide-toc-item ${activeId === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="guide-content" ref={contentRef}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {guideContent}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  )
}
