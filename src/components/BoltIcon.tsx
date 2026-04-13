import React from 'react'
import LightningBolt from './LightningBolt'

interface BoltIconProps {
  size?: number
  className?: string
}

export default function BoltIcon({ size = 160, className = '' }: BoltIconProps) {
  return <LightningBolt size={size} className={className} />
}
