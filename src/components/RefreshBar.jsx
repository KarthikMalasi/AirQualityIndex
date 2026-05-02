import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const RefreshIcon = ({ spinning }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={spinning ? 'animate-spin' : ''}
  >
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
)

export default function RefreshBar({ onRefresh, loading }) {
  const darkMode = useSelector((s) => s.ui.darkMode)
  const lastUpdated = useSelector((s) => s.airQuality.lastUpdated)
  const [countdown, setCountdown] = useState(60)
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    setCountdown(60)
  }, [lastUpdated])

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 60 : c - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!lastUpdated) return
    const update = () => {
      const diff = Math.floor((Date.now() - new Date(lastUpdated)) / 1000)
      if (diff < 60) setElapsed(`${diff}s ago`)
      else if (diff < 3600) setElapsed(`${Math.floor(diff / 60)}m ago`)
      else setElapsed(`${Math.floor(diff / 3600)}h ago`)
    }
    update()
    const i = setInterval(update, 5000)
    return () => clearInterval(i)
  }, [lastUpdated])

  return (
    <div className={`flex items-center justify-between text-xs px-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
      <span>
        {lastUpdated ? `Updated ${elapsed}` : 'Fetching data...'}
      </span>
      <div className="flex items-center gap-3">
        <span>Auto-refresh in {countdown}s</span>
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            darkMode
              ? 'hover:bg-white/5 hover:text-white'
              : 'hover:bg-gray-100 hover:text-gray-700'
          } disabled:opacity-40`}
        >
          <RefreshIcon spinning={loading} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  )
}
