import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadAirQuality, loadHistorical } from '../redux/slices/airQualitySlice'

const REFRESH_INTERVAL = 60 * 1000 // 60 seconds

export function useAirQuality() {
  const dispatch = useDispatch()
  const { selectedCity, current, loading, error, lastUpdated } = useSelector((s) => s.airQuality)

  const refresh = useCallback(() => {
    dispatch(loadAirQuality(selectedCity))
  }, [dispatch, selectedCity])

  // Load on mount and city change
  useEffect(() => {
    refresh()
  }, [refresh])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [refresh])

  return { current, loading, error, lastUpdated, refresh }
}
