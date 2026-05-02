import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

const POLLUTANT_THRESHOLDS = {
  pm25:  { good: 12, moderate: 35.4, sensitive: 55.4, unhealthy: 150.4, very: 250.4 },
  pm10:  { good: 54, moderate: 154, sensitive: 254, unhealthy: 354, very: 424 },
  o3:    { good: 54, moderate: 70, sensitive: 85, unhealthy: 105, very: 200 },
  no2:   { good: 53, moderate: 100, sensitive: 360, unhealthy: 649, very: 1249 },
  so2:   { good: 35, moderate: 75, sensitive: 185, unhealthy: 304, very: 604 },
  co:    { good: 4.4, moderate: 9.4, sensitive: 12.4, unhealthy: 15.4, very: 30.4 },
}

function getPollutantStatus(key, value) {
  const t = POLLUTANT_THRESHOLDS[key]
  if (!t) return { label: 'N/A', color: 'text-white/40', bar: 'bg-white/20', pct: 0 }

  let label, color, bar
  const max = t.very * 1.2
  const pct = Math.min((value / max) * 100, 100)

  if (value <= t.good) { label = 'Good'; color = 'text-aqi-good'; bar = 'bg-aqi-good' }
  else if (value <= t.moderate) { label = 'Moderate'; color = 'text-aqi-moderate'; bar = 'bg-aqi-moderate' }
  else if (value <= t.sensitive) { label = 'Sensitive'; color = 'text-aqi-sensitive'; bar = 'bg-aqi-sensitive' }
  else if (value <= t.unhealthy) { label = 'Unhealthy'; color = 'text-aqi-unhealthy'; bar = 'bg-aqi-unhealthy' }
  else { label = 'Very Unhealthy'; color = 'text-aqi-very'; bar = 'bg-aqi-very' }

  return { label, color, bar, pct }
}

function PollutantCard({ pollutantKey, pollutant, index, darkMode }) {
  const status = useMemo(() => getPollutantStatus(pollutantKey, pollutant.value), [pollutantKey, pollutant.value])

  return (
    <div
      className={`card animate-slide-up stagger-${Math.min(index + 1, 6)} ${darkMode ? '' : 'bg-white border-gray-200'} hover:border-white/10 transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`text-xs font-medium ${darkMode ? 'text-white/40' : 'text-gray-400'} uppercase tracking-wider`}>
            {pollutant.label}
          </p>
          <p className={`text-2xl font-mono font-medium mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {pollutant.value}
            <span className={`text-xs ml-1 font-sans ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{pollutant.unit}</span>
          </p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
          darkMode ? 'bg-surface' : 'bg-gray-50'
        } ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className={`h-1.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${status.bar} transition-all duration-700`}
          style={{ width: `${status.pct}%` }}
        />
      </div>
    </div>
  )
}

export default function PollutantGrid({ pollutants, loading, darkMode: darkModeProp }) {
  const darkModeStore = useSelector((s) => s.ui.darkMode)
  const darkMode = darkModeProp !== undefined ? darkModeProp : darkModeStore

  if (loading && !pollutants) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`card animate-pulse ${darkMode ? '' : 'bg-white border-gray-200'}`}>
            <div className={`h-3 rounded w-16 mb-3 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
            <div className={`h-7 rounded w-20 mb-4 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
            <div className={`h-1.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
          </div>
        ))}
      </div>
    )
  }

  if (!pollutants) return null

  const entries = Object.entries(pollutants)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map(([key, pollutant], i) => (
        <PollutantCard key={key} pollutantKey={key} pollutant={pollutant} index={i} darkMode={darkMode} />
      ))}
    </div>
  )
}
