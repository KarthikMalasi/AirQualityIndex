import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function NotFound() {
  const darkMode = useSelector((s) => s.ui.darkMode)
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <p className="text-6xl">🌫️</p>
      <h1 className={`text-3xl font-display font-700 ${darkMode ? 'text-white' : 'text-gray-900'}`}>404</h1>
      <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
        Page not found. The air is clear here — nothing to see!
      </p>
      <Link to="/" className="btn-primary mt-2">← Back to Dashboard</Link>
    </div>
  )
}
