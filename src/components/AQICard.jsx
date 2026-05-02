import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

const AQI_COLOR_MAP = {
  good: { ring: 'ring-aqi-good', bg: 'bg-aqi-good', text: 'text-aqi-good', glow: 'shadow-[0_0_40px_rgba(34,197,94,0.2)]' },
  moderate: { ring: 'ring-aqi-moderate', bg: 'bg-aqi-moderate', text: 'text-aqi-moderate', glow: 'shadow-[0_0_40px_rgba(234,179,8,0.2)]' },
  sensitive: { ring: 'ring-aqi-sensitive', bg: 'bg-aqi-sensitive', text: 'text-aqi-sensitive', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.2)]' },
  unhealthy: { ring: 'ring-aqi-unhealthy', bg: 'bg-aqi-unhealthy', text: 'text-aqi-unhealthy', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.2)]' },
  very: { ring: 'ring-aqi-very', bg: 'bg-aqi-very', text: 'text-aqi-very', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.2)]' },
  hazardous: { ring: 'ring-aqi-hazardous', bg: 'bg-red-900', text: 'text-red-400', glow: 'shadow-[0_0_40px_rgba(127,29,29,0.3)]' },
}

export default function AQICard({ data, loading }) {
  const darkMode = useSelector((s) => s.ui.darkMode)

  const colors = useMemo(() => {
    if (!data) return AQI_COLOR_MAP.good
    return AQI_COLOR_MAP[data.aqiCategory?.color] || AQI_COLOR_MAP.good
  }, [data])

  const percentage = useMemo(() => {
    if (!data) return 0
    return Math.min((data.aqi / 500) * 100, 100)
  }, [data])

  if (loading && !data) {
    return (
      <div className={`card animate-pulse ${darkMode ? '' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-6">
          <div className={`w-28 h-28 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
          <div className="flex-1 space-y-3">
            <div className={`h-4 rounded-lg w-24 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
            <div className={`h-8 rounded-lg w-16 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
            <div className={`h-3 rounded w-40 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Circular progress SVG
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const strokeDash = (percentage / 100) * circumference

  return (
    <div className={`card ${colors.glow} transition-all duration-500 animate-slide-up ${darkMode ? '' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular AQI meter */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle cx="60" cy="60" r={radius} fill="none" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} strokeWidth="8"/>
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              className={`transition-all duration-1000 ${colors.ring}`}
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - strokeDash}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-display font-800 ${colors.text}`}>{data.aqi}</span>
            <span className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>AQI</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${colors.bg} text-white`}>
              {data.aqiCategory?.label}
            </span>
            {loading && (
              <svg className="animate-spin text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="8" strokeLinecap="round"/>
              </svg>
            )}
          </div>

          <h2 className={`text-2xl font-display font-700 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {data.city}
            <span className={`text-sm font-sans font-400 ml-2 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
              {data.country}
            </span>
          </h2>

          <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
            {data.aqiCategory?.description}
          </p>

          <div className={`flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
            <span>{data.stationName}</span>
            <span>·</span>
            <span>{new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
