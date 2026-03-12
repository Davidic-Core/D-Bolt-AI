import React from 'react'
import './SuggestedPrompts.css'

interface Props {
  onSelectPrompt: (prompt: string) => void
}

const SUGGESTIONS = [
  'Explain React hooks in detail',
  'Write a Python function for factorial',
  'Help me debug this JavaScript error',
  'Refactor this code for better performance',
]

export default function SuggestedPrompts({ onSelectPrompt }: Props) {
  return (
    <div className="suggested-prompts">
      <p className="suggested-title">Try asking:</p>
      <div className="prompts-grid">
        {SUGGESTIONS.map((prompt, idx) => (
          <button
            key={idx}
            className="prompt-btn"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
