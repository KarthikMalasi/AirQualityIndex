import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { loadAirQuality, loadHistorical } from '../redux/slices/airQualitySlice'
import { useAirQuality } from '../hooks/useAirQuality'
import AQICard from '../components/AQICard'
import PollutantGrid from '../components/PollutantGrid'
import AQIChart from '../components/AQIChart'
import CitySearch from '../components/CitySearch'
import RefreshBar from '../components/RefreshBar'
import ErrorAlert from '../components/ErrorAlert'

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export default function Dashboard() {
  const dispatch = useDispatch()
  const darkMode = useSelector((s) => s.ui.darkMode)
  const favorites = useSelector((s) => s.cities.favorites)
  const { historical, historicalLoading } = useSelector((s) => s.airQuality)
  const { current, loading, error, refresh } = useAirQuality()

  const handleRefresh = useCallback(() => {
    refresh()
    const city = current?.city
    if (city) dispatch(loadHistorical(city))
  }, [refresh, dispatch, current])

  // Load historical on mount
  React.useEffect(() => {
    const city = current?.city
    if (city) dispatch(loadHistorical(city))
  }, [current?.city, dispatch])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className={`text-2xl font-display font-700 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h1>
          <p className={`text-sm mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>
            Real-time air quality monitoring
          </p>
        </div>
        <div className="w-full sm:w-72">
          <CitySearch />
        </div>
      </div>


      {/* Error */}
      {error && <ErrorAlert message={error} />}

      {/* AQI Card */}
      <AQICard data={current} loading={loading} />

      {/* Refresh bar */}
      <RefreshBar onRefresh={handleRefresh} loading={loading} />

      {/* Pollutants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`text-sm font-semibold ${darkMode ? 'text-white/60' : 'text-gray-500'} uppercase tracking-wider`}>
            Pollutants
          </h2>
          <Link
            to="/details"
            className={`flex items-center gap-1 text-xs font-medium transition-colors ${
              darkMode ? 'text-accent-cyan hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'
            }`}
          >
            Full details <ChevronRight />
          </Link>
        </div>
        <PollutantGrid pollutants={current?.pollutants} loading={loading} />
      </div>

      {/* Chart */}
      <AQIChart historical={historical} loading={historicalLoading} />
    </div>
  )
}
