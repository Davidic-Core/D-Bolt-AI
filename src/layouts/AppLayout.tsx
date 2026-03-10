import React from 'react'
import './AppLayout.css'

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="app-layout">
      <div className="app-layout-container">
        {children}
      </div>
    </div>
  )
}
