import React from 'react'
import './LightningBolt.css'

interface Props {
  size?: number
  className?: string
}

export default function LightningBolt({ size = 160, className = '' }: Props) {
  const width = size * 0.65

  return (
    <div className={`lightning-bolt-wrapper ${className}`} style={{ width, height: size }}>
      <svg
        viewBox="0 0 65 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="lightning-bolt-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="35%" stopColor="#22d3ee" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          <linearGradient id="boltGradientInner" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f9ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#67e8f9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </linearGradient>

          <filter id="glow" x="-50%" y="-30%" width="200%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur1" />
            <feGaussianBlur stdDeviation="6" result="blur2" />
            <feGaussianBlur stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="innerGlow" x="-20%" y="-10%" width="140%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow layer — large and soft */}
        <path
          d="M 52,2 L 18,78 L 36,78 L 14,158 L 63,82 L 42,82 Z"
          fill="#06b6d4"
          opacity="0.15"
          filter="url(#glow)"
        />

        {/* Mid glow layer */}
        <path
          d="M 52,2 L 18,78 L 36,78 L 14,158 L 63,82 L 42,82 Z"
          fill="#22d3ee"
          opacity="0.25"
          filter="url(#innerGlow)"
        />

        {/* Main bolt shape */}
        <path
          d="M 52,2 L 18,78 L 36,78 L 14,158 L 63,82 L 42,82 Z"
          fill="url(#boltGradient)"
          stroke="#67e8f9"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Inner highlight to give depth */}
        <path
          d="M 47,10 L 24,74 L 38,74 L 20,148 L 56,88 L 40,88 Z"
          fill="url(#boltGradientInner)"
          opacity="0.5"
        />

        {/* Core bright center line */}
        <path
          d="M 50,8 L 26,72 L 37,72 L 17,152 L 58,84 L 41,84 Z"
          fill="white"
          opacity="0.15"
        />
      </svg>
    </div>
  )
}
