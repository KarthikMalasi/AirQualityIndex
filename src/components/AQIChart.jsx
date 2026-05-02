import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts'

const POLLUTANTS = [
  { key: 'aqi', label: 'AQI', color: '#22d3ee', strokeWidth: 2.5 },
  { key: 'pm25', label: 'PM2.5', color: '#f97316', strokeWidth: 1.5 },
  { key: 'pm10', label: 'PM10', color: '#a855f7', strokeWidth: 1.5 },
  { key: 'no2', label: 'NO₂', color: '#eab308', strokeWidth: 1.5 },
]

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null
  return (
    <div className={`rounded-xl border p-3 text-xs shadow-xl ${
      darkMode ? 'bg-surface-card border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <p className={`font-medium mb-2 ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={darkMode ? 'text-white/60' : 'text-gray-500'}>{p.name}:</span>
          <span className="font-mono font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AQIChart({ historical, loading }) {
  const darkMode = useSelector((s) => s.ui.darkMode)
  const [activePollutants, setActivePollutants] = useState(['aqi', 'pm25'])

  const togglePollutant = (key) => {
    setActivePollutants((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const chartData = useMemo(() => historical || [], [historical])

  if (loading && !historical?.length) {
    return (
      <div className={`card animate-pulse ${darkMode ? '' : 'bg-white border-gray-200'}`}>
        <div className={`h-4 rounded w-32 mb-6 ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
        <div className={`h-48 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
      </div>
    )
  }

  return (
    <div className={`card ${darkMode ? '' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          24-Hour Trend
        </h3>
        <div className="flex gap-1.5">
          {POLLUTANTS.map((p) => (
            <button
              key={p.key}
              onClick={() => togglePollutant(p.key)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                activePollutants.includes(p.key)
                  ? 'text-white'
                  : darkMode ? 'text-white/30 bg-white/5' : 'text-gray-400 bg-gray-100'
              }`}
              style={activePollutants.includes(p.key) ? { background: p.color + '30', color: p.color } : {}}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fill: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          {POLLUTANTS.filter((p) => activePollutants.includes(p.key)).map((p) => (
            <Line
              key={p.key}
              type="monotone"
              dataKey={p.key}
              name={p.label}
              stroke={p.color}
              strokeWidth={p.strokeWidth}
              dot={false}
              activeDot={{ r: 4, fill: p.color, stroke: 'none' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
