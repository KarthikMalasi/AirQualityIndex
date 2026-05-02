import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'
import { useAirQuality } from '../hooks/useAirQuality'
import PollutantGrid from '../components/PollutantGrid'
import AQICard from '../components/AQICard'

const COLORS = ['#22d3ee', '#f97316', '#a855f7', '#eab308', '#ef4444', '#22c55e']

const WHO_GUIDELINES = {
  pm25: 15, pm10: 45, o3: 100, no2: 25, so2: 40, co: 4,
}

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className={`rounded-xl border p-3 text-xs shadow-xl ${
      darkMode ? 'bg-surface-card border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      <p className="font-semibold">{d.payload.label}</p>
      <p className="mt-1">
        <span className={darkMode ? 'text-white/50' : 'text-gray-500'}>Value: </span>
        <span className="font-mono">{d.value} {d.payload.unit}</span>
      </p>
      {d.payload.who && (
        <p className="mt-0.5">
          <span className={darkMode ? 'text-white/50' : 'text-gray-500'}>WHO limit: </span>
          <span className="font-mono">{d.payload.who} {d.payload.unit}</span>
        </p>
      )}
    </div>
  )
}

export default function Details() {
  const darkMode = useSelector((s) => s.ui.darkMode)
  const { current, loading } = useAirQuality()

  const chartData = useMemo(() => {
    if (!current?.pollutants) return []
    return Object.entries(current.pollutants).map(([key, p], i) => ({
      key,
      label: p.label,
      value: p.value,
      unit: p.unit,
      who: WHO_GUIDELINES[key],
      color: COLORS[i % COLORS.length],
    }))
  }, [current])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className={`text-sm flex items-center gap-1 transition-colors ${
            darkMode ? 'text-white/40 hover:text-white' : 'text-gray-400 hover:text-gray-900'
          }`}
        >
          ← Back
        </Link>
        <div>
          <h1 className={`text-2xl font-display font-700 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pollutant Details
          </h1>
          {current && (
            <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
              {current.city} · {new Date(current.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <AQICard data={current} loading={loading} />

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className={`card ${darkMode ? '' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pollutant Concentrations
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'} vertical={false} />
              <XAxis
                dataKey="key"
                tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Pollutant detail cards */}
      <div>
        <h2 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white/60' : 'text-gray-500'} uppercase tracking-wider`}>
          All Pollutants
        </h2>
        <PollutantGrid pollutants={current?.pollutants} loading={loading} />
      </div>

      {/* WHO guidelines */}
      <div className={`card ${darkMode ? '' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          WHO Air Quality Guidelines (Annual Mean)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(WHO_GUIDELINES).map(([key, val]) => (
            <div key={key} className={`rounded-xl p-3 ${darkMode ? 'bg-surface' : 'bg-gray-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'} uppercase tracking-wide`}>{key.toUpperCase()}</p>
              <p className={`font-mono font-medium text-sm mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {val} <span className={`text-xs ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>µg/m³</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
